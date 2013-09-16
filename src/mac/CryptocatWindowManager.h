//
//  CryptocatWindowManager.h
//  Cryptocat
//
//  Created by Frederic Jacobs on 22/6/13.
//  Copyright (c) 2013 Cryptocat. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface CryptocatWindowManager : NSObject<NSWindowDelegate>

@property (nonatomic,retain) NSMutableArray *conversationWindows;

#pragma mark Singleton instance

+ (id)sharedManager;

#pragma mark Instance methods

- (void)initiateNewConversation;
- (void)removeConversationWindow:(NSWindow*) conversation;

@end
