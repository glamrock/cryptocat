//
//  CryptocatNetworkManager.m
//  Cryptocat
//
//  Created by Frederic Jacobs on 23/8/13.
//  Copyright (c) 2013 Cryptocat. All rights reserved.
//

#import "CryptocatNetworkManager.h"
#import "CryptocatWindowManager.h"
#import "CryptocatAppDelegate.h"
#import "CryptocatDockIconController.h"
#import <Tor/Tor.h>

@implementation CryptocatNetworkManager

- (id)init {
	if (self = [super init]) {
        [[HITorManager defaultManager] isRunning];
        [[HITorManager defaultManager] addObserver:self forKeyPath:@"isRunning" options:NSKeyValueObservingOptionInitial | NSKeyValueObservingOptionNew context:NULL];
	}
	return self;
}

+ (BOOL) torShouldBeUsed{
	// This line only returns true if the user turned on Tor
	// We want Tor to be an opt-in feature (at least during the experimental period)
	// Let's remember the preferences of a user to use Tor or not.
	return [[NSUserDefaults standardUserDefaults] boolForKey:kKeyForTorPreferences];
}

- (BOOL) isTorRunning{
	return [[HITorManager defaultManager] isRunning];
}

- (void) startTor{
    [HITorManager defaultManager].torRouting = YES;
    if (![HITorManager defaultManager].isRunning) {
        [[CryptocatDockIconController sharedManager]setTorStatusIcon:kTorYellow];
        [[HITorManager defaultManager] start];
    }else{
        [[CryptocatDockIconController sharedManager]setTorStatusIcon:kTorGreen];
    }
}

- (void) stopTor{
    [HITorManager defaultManager].torRouting = NO;
}

+ (id) sharedManager {
    static CryptocatNetworkManager *sharedMyManager = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedMyManager = [[self alloc] init];
    });
    return sharedMyManager;
}

- (void) toggleTor{
    if (![CryptocatNetworkManager torShouldBeUsed]) {
        NSAlert *alert = [NSAlert alertWithMessageText:@"Warning: Tor is an experimental feature." defaultButton:@"Continue" alternateButton:@"Cancel" otherButton:nil informativeTextWithFormat:@"Tor integration is an experimental feature of Cryptocat and bugs can be encountered while using this feature."];
        NSInteger proceed = [alert runModal];
        if (!proceed) {
            return;
        }
    }
    [[NSUserDefaults standardUserDefaults] setBool:![CryptocatNetworkManager torShouldBeUsed] forKey:kKeyForTorPreferences];
    [[NSUserDefaults standardUserDefaults] synchronize];
    
    CryptocatAppDelegate *delegate = (CryptocatAppDelegate*)[[NSApplication sharedApplication] delegate];
    [delegate reinitialize];
}

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary *)change context:(void *)context
{
    if (object == [HITorManager defaultManager] && [HITorManager defaultManager].isRunning)
    {
        // Tor did connect. Let's open a chat window.
        NSLog(@"Tor did start!");
        [[CryptocatDockIconController sharedManager]setTorStatusIcon:kTorGreen];
        [[CryptocatWindowManager sharedManager] initiateNewConversation];
    } else{
        // Tor did disconnect. Let's close all chat windows
        // The proxy should still be enabled, so there should not be leaks and will reconnect as soon as a new tor circuits rebuilds
        NSLog(@"Tor did stop!");
        [[CryptocatDockIconController sharedManager]setTorStatusIcon:kTorRed];
    }
}

@end
