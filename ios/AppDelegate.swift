//
//  AppDelegate.swift
//  RNSwiftReviewer
//
//  Created by Dominic Go on 6/30/20.
//

import Foundation
import UIKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
  
  var window: UIWindow?;
  
  func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    ReactNativeNavigation.bootstrap(with: self, launchOptions: launchOptions);
    return true;
  };
};

extension AppDelegate: RCTBridgeDelegate {
  func sourceURL(for bridge: RCTBridge!) -> URL! {
    #if DEBUG
    print("DEBUG: using RCTBundleURLProvider");
    
    return RCTBundleURLProvider
      .sharedSettings()
      .jsBundleURL(forBundleRoot: "index", fallbackResource: nil);
    
    #else
    return Bundle.main.url(forResource: "main", withExtension: "jsbundle")!;
    #endif
  };
};

