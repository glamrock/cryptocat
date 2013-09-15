//
//  CryptocatAppDelegate.m
//  Cryptocat
//
//  Created by Nadim Kobeissi on 2013-06-20.
//  Copyright (c) 2013 Cryptocat. All rights reserved.
//

#import "CryptocatAppDelegate.h"
#import "CryptocatWindowManager.h"
#import "CryptocatNetworkManager.h"
#import "CryptocatDockIconController.h"

@implementation CryptocatAppDelegate;

// To support multiple windows chats we implement the dock menu delegate method

- (NSMenu *)applicationDockMenu:(NSApplication *)sender{
	NSMenu *dockMenu = [[NSMenu alloc]initWithTitle:kApplicationName];
	// We also want command + N to initiate a new chat window but addItem:initWithTitle:action:keyEquivalent doesn't support key modifiers so we just set it to an empty NSString.
	[dockMenu addItem:[[NSMenuItem alloc] initWithTitle:@"New Window" action:@selector(openChatWindow) keyEquivalent:@""]];
	return dockMenu;
}

- (void)applicationDidFinishLaunching:(NSNotification *)notification{
	[self refreshTorMenuIcon];
    [CryptocatDockIconController sharedManager];
	[self openChatWindow:nil];
	_isReinitializing = FALSE;
}

- (void) refreshTorMenuIcon{
	//Let's set the Tor Menu Icon
	NSMenu *mainMenu = [NSApp mainMenu];
	mainMenu.delegate = self;
	NSMenu *cryptoCatMenu = [[mainMenu itemWithTitle:@"Cryptocat"] submenu];
	NSMenuItem *tor = [cryptoCatMenu itemWithTag:kTorMenuItemTag];
	tor.title = ([CryptocatNetworkManager torShouldBeUsed]) ? @"Disable Tor" : @"Enable Tor";
	[tor setTarget:[CryptocatNetworkManager sharedManager]];
	[tor setAction:@selector(toggleTor)];
}

- (IBAction)openChatWindow:(id)sender{
	// Let's check if Tor is required to be on
	
	if ([CryptocatNetworkManager torShouldBeUsed] && ![[CryptocatNetworkManager sharedManager] isTorRunning]) {
		//Initiate Tor
        [[CryptocatNetworkManager sharedManager]startTor];
	} else if ([CryptocatNetworkManager torShouldBeUsed] && [[CryptocatNetworkManager sharedManager] isTorRunning]){
		//We run the startTor method again to make sure the routing is right
        [[CryptocatNetworkManager sharedManager]startTor];
        [[CryptocatWindowManager sharedManager] initiateNewConversation];
	} else {
		// Traffic shouldn't go through Tor.
        if ([[CryptocatNetworkManager sharedManager] isTorRunning]) {
            [[CryptocatNetworkManager sharedManager] stopTor];
        }
        [[CryptocatDockIconController sharedManager]setTorStatusIcon:kTorOff];
        [[CryptocatWindowManager sharedManager] initiateNewConversation];
	}
}

- (void)applicationDidBecomeActive:(NSNotification *)notification{
	[[NSUserNotificationCenter defaultUserNotificationCenter] removeAllDeliveredNotifications];
}


// The reinitialize method enables Cryptocat to close all existing connections so that all new sessions go through tor forgiving about previous sessions. It closes all the open windows and updates the doc icon. Once the Tor circuit is ready, it opens a chat window.

- (void) reinitialize{
	// Close All Windows.
	_isReinitializing = YES;
	[[CryptocatWindowManager sharedManager]removeAllConversationWindows];
	// Refresh Menu Bar Icon
	[self refreshTorMenuIcon];
	// Launch Tor Circuit
    [self openChatWindow:nil];
}

- (BOOL) applicationShouldTerminateAfterLastWindowClosed: (NSApplication *) theApplication{
	if (_isReinitializing) {
		return NO;
	}else{
		return YES;
	}
}

@end