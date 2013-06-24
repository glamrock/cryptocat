//
//  CryptocatWindow.h
//  Cryptocat
//
//  Created by Frederic Jacobs on 22/6/13.
//  Copyright (c) 2013 Cryptocat. All rights reserved.
//

#import <Cocoa/Cocoa.h>
#import <WebKit/WebKit.h>

@interface CryptocatWindowController : NSWindowController <NSWindowDelegate>

@property IBOutlet WebView *webView;

@end
