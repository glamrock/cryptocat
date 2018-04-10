//
//  CryptocatWindowManager.m
//	The Window Manager handles the making of discussions and also tells the NetworkManager if they have to be routed by Tor!
//Cryptocat
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
	// If there is already an open discussion let's place that new window a few pixels beneath it so that there is no confusion between windows.
	
	CryptocatWindowController *controller = [[CryptocatWindowController alloc]init];
	
	if ([self.conversationWindows count]>0) {
		CryptocatWindowController *wC = [self.conversationWindows lastObject];
		[controller.window setFrame:wC.window.frame display:YES animate:NO];
		[controller.window setFrame:CGRectOffset(wC.window.frame, 40, 0) display:NO animate:YES];
	}else{
		[controller.window center];
		[controller showWindow:nil];
	}
	
	[self.conversationWindows addObject:controller];
}

- (void)removeConversationWindow:(NSWindow*) conversation{
	CryptocatWindowController *conversationController;
	for (CryptocatWindowController* controller in self.conversationWindows) {
		if ([controller.window isEqualTo:conversation]) {
			conversationController = controller;
		}
	}
	if (conversationController) {
		[self removeWindowController:conversationController];
	}
}

- (void)removeAllConversationWindows{
	for (CryptocatWindowController* controller in self.conversationWindows) {
		[self removeWindowController:controller];
	}
}

- (void)removeWindowController:(CryptocatWindowController*)CWC{
	[CWC.webView stopLoading:nil];
	[CWC.webView close];
	[self.conversationWindows removeObject:CWC];
}

#pragma mark NSWindowDelegate protocol methods

- (void)windowWillClose:(NSNotification *)notification{
	[self removeConversationWindow:[notification object]];
}

@end
