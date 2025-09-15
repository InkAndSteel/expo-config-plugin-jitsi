import {
  ConfigPlugin,
  withAndroidManifest,
  withInfoPlist,
  withAppBuildGradle,
  AndroidConfig,
  withProjectBuildGradle,
} from "@expo/config-plugins";

const withJitsiSDK: ConfigPlugin = (config) => {
  // 1. App-level build.gradle Configuration (add Jitsi Maven repo)
  config = withAppBuildGradle(config, (config) => {
    config.modResults.contents = config.modResults.contents.replace(
      /repositories {/,
      `repositories {
        maven { url "https://github.com/jitsi/jitsi-maven-repository/raw/master/releases" }`
    );
    return config;
  });

  // 2. Project-level build.gradle Configuration (inject gradlePluginVersion into ext)
  config = withProjectBuildGradle(config, (config) => {
    if (config.modResults.language === "groovy") {
      let contents = config.modResults.contents;

      if (
        contents.includes("ext {") &&
        !contents.includes("gradlePluginVersion")
      ) {
        contents = contents.replace(
          /ext\s*{([^}]*)}/,
          (match, group) =>
            `ext {\n    gradlePluginVersion = "8.6.0"\n${group}}`
        );
      } else if (!contents.includes("ext {")) {
        contents += `

ext {
    gradlePluginVersion = "8.6.0"
}
`;
      }

      config.modResults.contents = contents;
    }
    return config;
  });

  // 3. Android Manifest Configuration (permissions)
  config = withAndroidManifest(config, (config) => {
    const androidManifest = config.modResults;
    const permissions = [
      "android.permission.ACCESS_NETWORK_STATE",
      "android.permission.BLUETOOTH",
      "android.permission.CAMERA",
      "android.permission.INTERNET",
      "android.permission.MANAGE_OWN_CALLS",
      "android.permission.MODIFY_AUDIO_SETTINGS",
      "android.permission.RECORD_AUDIO",
      "android.permission.WAKE_LOCK",
      "android.permission.ACCESS_WIFI_STATE",
      "android.permission.FOREGROUND_SERVICE",
      "android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK",
      "android.permission.FOREGROUND_SERVICE_MEDIA_PROJECTION",
    ];

    permissions.forEach((permission) => {
      AndroidConfig.Permissions.addPermission(androidManifest, permission);
    });

    return config;
  });

  // 4. iOS Info.plist Configuration
  config = withInfoPlist(config, (config) => {
    config.modResults = {
      ...config.modResults,
      NSCameraUsageDescription: "Camera access is required for video calls",
      NSMicrophoneUsageDescription: "Microphone access is required for calls",
      UIViewControllerBasedStatusBarAppearance: false,
      RTCScreenSharingExtension: `${config.modResults.CFBundleIdentifier}.broadcast`,
      UIBackgroundModes: [
        ...(config.modResults.UIBackgroundModes || []),
        "voip",
      ],
    };
    return config;
  });

  return config;
};

export default withJitsiSDK;
