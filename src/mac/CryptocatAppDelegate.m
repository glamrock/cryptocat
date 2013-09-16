//
//  CryptocatAppDelegate.m
//  Cryptocat
//
//  Created by Nadim Kobeissi on 2013-06-20.
//  Copyright (c) 2013 Cryptocat. All rights reserved.
//

#import "CryptocatAppDelegate.h"
#import "CryptocatWindowManager.h"

@implementation CryptocatAppDelegate;

// To support multiple windows chats we implement the dock menu delegate method

- (NSMenu *)applicationDockMenu:(NSApplication *)sender{
	NSMenu *dockMenu = [[NSMenu alloc]initWithTitle:kApplicationName];
	// We also want command + N to initiate a new chat window but addItem:initWithTitle:action:keyEquivalent doesn't support key modifiers so we just set it to an empty NSString.
	[dockMenu addItem:[[NSMenuItem alloc] initWithTitle:@"New Window" action:@selector(openChatWindow) keyEquivalent:@""]];
	return dockMenu;
}

- (void)applicationDidFinishLaunching:(NSNotification *)notification{
	[self openChatWindow:nil];
}

- (IBAction)openChatWindow:(id)sender{
	[[CryptocatWindowManager sharedManager]initiateNewConversation];
}

- (void)applicationDidBecomeActive:(NSNotification *)notification{
	[[NSUserNotificationCenter defaultUserNotificationCenter] removeAllDeliveredNotifications];
}

- (BOOL) applicationShouldTerminateAfterLastWindowClosed: (NSApplication *) theApplication{
	return YES;
}

@end
