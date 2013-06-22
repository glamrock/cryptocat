//
//  CryptocatWindowManager.m
//  Cryptocat
//
//  Created by Frederic Jacobs on 22/6/13.
//  Copyright (c) 2013 Cryptocat. All rights reserved.
//

#import "CryptocatWindowManager.h"
#import "CryptocatWindowController.h"

@implementation CryptocatWindowManager

- (id)init {
	if (self = [super init]) {
		self.conversationWindows = [NSMutableArray array];
	}
	return self;
}

+ (id)sharedManager {
    static CryptocatWindowManager *sharedMyManager = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedMyManager = [[self alloc] init];
    });
    return sharedMyManager;
}

- (void)initiateNewConversation{
	CryptocatWindowController *controller = [[CryptocatWindowController alloc]init];
	[self.conversationWindows addObject:controller];
	[controller showWindow:nil];
}

- (void)removeConversationWindow:(NSWindow*) conversation{
	CryptocatWindowController *conversationController;
	for (CryptocatWindowController* controller in self.conversationWindows) {
		if ([controller.window isEqualTo:conversation]) {
			conversationController = controller;
		}
	}
	if (conversationController) {
		[conversationController.webView stopLoading:nil];
		[conversationController.webView close];		
		[self.conversationWindows removeObject:conversationController];
	}
}

#pragma mark NSWindowDelegate protocol methods

- (void)windowWillClose:(NSNotification *)notification{
	[self removeConversationWindow:[notification object]];
}

@end
