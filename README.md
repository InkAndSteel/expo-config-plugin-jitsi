# @inkandsteel/expo-config-plugin-jitsi

An Expo config plugin to add Jitsi Meet SDK support to your Expo project.

## Installation

### using npm

npm install @inkandsteel/expo-config-plugin-jitsi

### using yarn

yarn add @inkandsteel/expo-config-plugin-jitsi

## Usage

Add the plugin to your Expo config in app.json or app.config.js:

```json
{
  "expo": {
    "plugins": ["@inkandsteel/expo-config-plugin-jitsi"]
  }
}
```

## What it does

This plugin automatically:

- iOS Configuration:
  - Adds JitsiMeetSDK pod
  - Configures required permissions
- Android Configuration:
  - Adds Jitsi Maven repository
  - Adds Jitsi SDK dependency
  - Configures required permissions and activities

## Permissions

This plugin adds the following permissions:

- iOS

  - Camera access
  - Microphone access

- Android

  - Camera
  - Record Audio
  - Internet
  - Modify Audio Settings
  - Wake Lock

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
License
