//
//  CryptocatWindow.m
//  Cryptocat
//
//  Created by Frederic Jacobs on 22/6/13.
//  Copyright (c) 2013 Cryptocat. All rights reserved.
//

#import "CryptocatWindowController.h"

@interface WebPreferences (WebPreferencesPrivate)
- (void)_setLocalStorageDatabasePath:(NSString *)path;
- (void) setLocalStorageEnabled:(BOOL)localStorageEnabled;
@end

@implementation CryptocatWindowController

- (id)init{
	self = [self initWithWindowNibName:@"CryptocatWindowController" owner:self];

	if (self) {
		self.roomname = nil;
	}
	return self;
}

- (void)awakeFromNib{
	NSString *appSupportPath = [NSSearchPathForDirectoriesInDomains(NSApplicationSupportDirectory, NSUserDomainMask, YES) objectAtIndex:0];
	NSString *htmlPath = htmlPath = [[[NSBundle mainBundle] resourcePath] stringByAppendingPathComponent:@"/htdocs/index.html"];
	
	// Set user agent to Chrome in order to load some Cryptocat features not available to Safari.
	[_webView setCustomUserAgent:@"Chrome (Mac app)"];
	
	// Initialize localStorage.
	WebPreferences* prefs = [WebPreferences standardPreferences];
	[prefs _setLocalStorageDatabasePath:appSupportPath];
	[prefs setLocalStorageEnabled:YES];
	[_webView setPreferences:prefs];
	
	// Initialize Cryptocat.
	[[_webView mainFrame] loadRequest:[NSURLRequest requestWithURL:[NSURL fileURLWithPath:htmlPath]]];
}

// Show Cryptocat window once everything is ready.
- (void)webView:(WebView *)sender didFinishLoadForFrame:(WebFrame *)frame {
	[self.window makeKeyAndOrderFront:nil];
	[self.window center];
}

// Bind file dialog for file transfers.
- (void)webView:(WebView *)sender runOpenPanelForFileButtonWithResultListener:(id <WebOpenPanelResultListener>)resultListener {
    NSOpenPanel* openDlg = [NSOpenPanel openPanel];
    [openDlg setCanChooseFiles:YES];
    [openDlg setCanChooseDirectories:NO];
    if ([openDlg runModal] == NSOKButton) {
        NSArray* files = [[openDlg URLs]valueForKey:@"relativePath"];
        [resultListener chooseFilenames:files];
    }
}

// Remove useless items from webView context menu.
- (NSArray *)webView:(WebView *)sender contextMenuItemsForElement:(NSDictionary *)element defaultMenuItems:(NSArray *)defaultMenuItems {
	NSMutableArray *defaultMenuItemsFixed = [(NSArray*)defaultMenuItems mutableCopy];
	[defaultMenuItemsFixed removeObjectAtIndex:0];
	return defaultMenuItemsFixed;
}

// We use an iFrame location's property as a bridge to Objective-C from JavaScript.

- (void)webView:(WebView *)sender decidePolicyForNavigationAction:(NSDictionary *)actionInformation request:(NSURLRequest *)request frame:(WebFrame *)frame decisionListener:(id<WebPolicyDecisionListener>)listener
{
    if ([[[request URL] absoluteString] hasPrefix:@"js-call:"]) {
		NSArray *components = [[[request URL] absoluteString] componentsSeparatedByString:@":"];
		NSUserNotification *userNotification = [[NSUserNotification alloc]init];
		userNotification.title = [components[1] stringByReplacingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
		userNotification.subtitle = [components[2] stringByReplacingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
		userNotification.hasActionButton = FALSE;
		[[NSUserNotificationCenter defaultUserNotificationCenter] deliverNotification:userNotification];
    }
	else{
		[listener use];
	}
}

// We want to have the name of the room to switch between rooms

- (void)setTitleOfView:(NSString*)name{
	self.roomname = name;
	self.window.title = name?kApplicationName:[kApplicationName stringByAppendingFormat:@" - %@", name];
}

@end
