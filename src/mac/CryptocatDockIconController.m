//
//  CryptocatDockIconController.m
//  Cryptocat
//
//  Created by Frederic Jacobs on 9/15/13.
//  Copyright (c) 2013 Cryptocat. All rights reserved.
//

#import "CryptocatDockIconController.h"

//  Here are the constants regarding the placement of the Tor icon on the Cryptocat dock icon.

#define kDockIconSize 128
#define kTorIconSize 53
#define kTorIconOffsetLeft kDockIconSize-kTorIconSize
#define kTorIconOffsetBottom kDockIconSize-kTorIconSize

@implementation CryptocatDockIconController

- (id)init {
	if (self = [super init]) {
        NSDockTile *tile = [NSApp dockTile];
        NSImageView *imageView = [[NSImageView alloc]initWithFrame:NSMakeRect(0, 0, kDockIconSize, kDockIconSize)];
        [imageView setImage:[NSImage imageNamed:@"Cryptocat.icns"]];
        self.currentTorStatus = [[NSImageView alloc]initWithFrame:NSMakeRect(kTorIconOffsetLeft, kTorIconOffsetBottom, kTorIconSize, kTorIconSize)];
        [imageView addSubview:self.currentTorStatus];
        [tile setContentView:imageView];
	}
	return self;
}

+ (id)sharedManager {
    static CryptocatDockIconController *sharedMyManager = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedMyManager = [[self alloc] init];
    });
    return sharedMyManager;
}

- (void) setTorStatusIcon:(TorStatusType)status{
    NSString *imageString = nil;
    switch (status) {
        case kTorGreen:
            imageString = @"tor-green.png";
            break;
        case kTorYellow:
            imageString = @"tor-yellow.png";
            break;
        case kTorRed:
            imageString = @"tor-red.png";
            break;
        case kTorOff:
            imageString = nil;
            break;
        default:
            break;
    }
    [self.currentTorStatus setImage:[NSImage imageNamed:imageString]];
    // This tells the Mac to redraw the Dock Tile
    [[[NSApplication sharedApplication]dockTile]display];
}

@end
