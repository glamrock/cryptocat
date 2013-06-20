//
//  CryptocatAppDelegate.h
//  Cryptocat
//
//  Created by Nadim Kobeissi on 2013-06-20.
//  Copyright (c) 2013 Cryptocat. All rights reserved.
//

#import <Cocoa/Cocoa.h>
#import <WebKit/WebKit.h>

@interface CryptocatAppDelegate : NSObject <NSApplicationDelegate> {
	IBOutlet WebView *webView;
}

@property (assign) IBOutlet NSWindow *window;
@property (nonatomic, retain) IBOutlet WebView *webView;

@end
