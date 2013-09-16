//
//  CryptocatNetworkManager.h
//  Cryptocat
//
//  Created by Frederic Jacobs on 23/8/13.
//  Copyright (c) 2013 Cryptocat. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface CryptocatNetworkManager : NSObject

typedef void (^torCompletionBlock)(BOOL connectionDidSucceed);

+ (id)sharedManager;
+ (BOOL) torShouldBeUsed;
- (void) toggleTor;
- (BOOL) isTorRunning;
- (void) startTor;
- (void) stopTor;

@end
