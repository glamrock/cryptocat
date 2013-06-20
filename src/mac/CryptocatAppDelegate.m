//
//  CryptocatAppDelegate.m
//  Cryptocat
//
//  Created by Nadim Kobeissi on 2013-06-20.
//  Copyright (c) 2013 Cryptocat. All rights reserved.
//

#import "CryptocatAppDelegate.h"

@interface WebPreferences (WebPreferencesPrivate)
- (void)_setLocalStorageDatabasePath:(NSString *)path;
- (void) setLocalStorageEnabled:(BOOL)localStorageEnabled;
@end

@implementation CryptocatAppDelegate;

@synthesize window;
@synthesize webView;

- (void)awakeFromNib {
	NSString *appSupportPath = [NSSearchPathForDirectoriesInDomains(NSApplicationSupportDirectory, NSUserDomainMask, YES) objectAtIndex:0];
	NSString *htmlPath = htmlPath = [[[NSBundle mainBundle] resourcePath] stringByAppendingPathComponent:@"/htdocs/index.html"];
	
	// Set user agent to Chrome in order to load some Cryptocat features not available to Safari.
	[webView setCustomUserAgent:@"Chrome (Mac app)"];
	
	// Initialize localStorage.
	WebPreferences* prefs = [WebPreferences standardPreferences];
	[prefs _setLocalStorageDatabasePath:appSupportPath];
	[prefs setLocalStorageEnabled:YES];
	[webView setPreferences:prefs];
	
	// Initialize Cryptocat.
	[[webView mainFrame] loadRequest:[NSURLRequest requestWithURL:[NSURL fileURLWithPath:htmlPath]]];
}

// Show Cryptocat window once everything is ready.
- (void)webView:(WebView *)sender didFinishLoadForFrame:(WebFrame *)frame {
	[window makeKeyAndOrderFront:self];
	[window center];
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

@end
