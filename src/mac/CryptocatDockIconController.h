//
//  CryptocatDockIconController.h
//  Cryptocat
//
//  Created by Frederic Jacobs on 9/15/13.
//  Copyright (c) 2013 Cryptocat. All rights reserved.
//

#import <Foundation/Foundation.h>

typedef enum {
    kTorGreen,
    kTorYellow,
    kTorRed,
    kTorOff
} TorStatusType;

@interface CryptocatDockIconController : NSObject

@property (nonatomic, retain) NSImageView *currentTorStatus;

#pragma mark Singleton instance

+ (id)sharedManager;

#pragma mark Change Icon Display

- (void) setTorStatusIcon:(TorStatusType)status;

@end
