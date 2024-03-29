#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <UserNotifications/UserNotifications.h>
#import "Fingerpush.h"


@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"pushNotiTest";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  center.delegate = self;
\
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

//

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  [Fingerpush didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}

- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
  NSLog(@"%@", error);
  [Fingerpush didFailToRegisterForRemoteNotificationsWithError:error];
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center
didReceiveNotificationResponse:(UNNotificationResponse *)response
withCompletionHandler:(void (^)(void))completionHandler {
  
  NSLog(@"response.actionIdentifier : %@",response.actionIdentifier);
  NSLog(@"userNotificationCenter Userinfo %@",response.notification.request.content.body);
  NSLog(@"userNotificationCenter push data = %@",response.notification.request.content.userInfo);
  
  NSDictionary *userInfo = response.notification.request.content.userInfo;

  [Fingerpush didReceiveRemoteNotification: userInfo];

}

-(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
{
  completionHandler(UNNotificationPresentationOptionAlert + UNNotificationPresentationOptionSound);
    
    [Fingerpush willPresentNotification:notification.request.content.userInfo];
}

//

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self getBundleURL];
}

- (NSURL *)getBundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
