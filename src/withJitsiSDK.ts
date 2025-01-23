import {
  ConfigPlugin,
  withAndroidManifest,
  withInfoPlist,
  withAppBuildGradle,
  AndroidConfig,
  withPodfile
} from "@expo/config-plugins";

const withJitsiSDK: ConfigPlugin = (config) => {
  // 1. Android Gradle Configuration
  config = withAppBuildGradle(config, (config) => {
    config.modResults.contents = config.modResults.contents.replace(
      /repositories {/,
      `repositories {
        maven { url "https://github.com/jitsi/jitsi-maven-repository/raw/master/releases" }`
    );
    return config;
  });

  config = withAppBuildGradle(config, (config) => {
    config.modResults.contents = config.modResults.contents.replace(
      /dependencies {/,
      `dependencies {
        implementation ('org.jitsi.react:jitsi-meet-sdk:+') { transitive = true }`
    );
    return config;
  });

  // 2. iOS Podfile Configuration
  config = withPodfile(config, (config) => {
    config.modResults.contents = config.modResults.contents.replace(
      /use_react_native/,
      `use_react_native
    pod 'JitsiMeetSDK', '~> 4.0.0'`
    );
    return config;
  });

  // 3. Android Manifest Configuration
  config = withAndroidManifest(config, (config) => {
    const androidManifest = config.modResults;

    // Add permissions
    const permissions = [
      "android.permission.CAMERA",
      "android.permission.RECORD_AUDIO",
      "android.permission.INTERNET",
      "android.permission.MODIFY_AUDIO_SETTINGS",
      "android.permission.WAKE_LOCK"
    ];

    permissions.forEach((permission) => {
      AndroidConfig.Permissions.addPermission(androidManifest, permission);
    });

    // Add Jitsi Activity
    const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(androidManifest);

    mainApplication.activity = mainApplication.activity || [];
    mainApplication.activity.push({
      $: {
        "android:name": "com.reactnativejitsimeet.JitsiMeetNavigatorActivity",
        "android:exported": "true",
        "android:launchMode": "singleTask",
        "android:resizeableActivity": "true",
        "android:supportsPictureInPicture": "true",
        "android:windowSoftInputMode": "adjustResize"
      }
    });

    return config;
  });

  // 4. iOS Info.plist Configuration
  config = withInfoPlist(config, (config) => {
    config.modResults.NSCameraUsageDescription = "Camera access is required for video calls";
    config.modResults.NSMicrophoneUsageDescription = "Microphone access is required for calls";

    return config;
  });

  return config;
};

export default withJitsiSDK;
