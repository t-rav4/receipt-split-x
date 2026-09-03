# Receipt Split

A small React Native (Expo) prototype for quickly splitting receipt costs among friends and family. This is the second prototype focused on core flows for selecting a receipt, assigning items to users, and viewing a split summary.

## Quick start

- Install dependencies:

  ```bash
  npm install
  ```

- First-time Android/dev-client (builds and installs a development client on the emulator or device):

  ```bash
  npm run android
  ```

  Note: `npm run android` runs `expo run:android` which builds a development client. You must have Android Studio with a configured Android Virtual Device (AVD) or a connected Android device.

- Start the Expo dev server for the development client:

  ```bash
  npx expo start --dev-client
  ```

## Useful scripts

- `npm run android` — build & install development client to Android emulator/device
- `npx expo start --dev-client` — start metro for the dev-client
- `npm start` / `npx expo start` — standard Expo start (Expo Go/web)
- `npm run ios` — build & install on iOS (macOS + Xcode required)
- `npm test` — run Jest tests
- `npm run lint` — run linter

## Prerequisites

- Node.js (16+ recommended)
- Yarn or npm
- Android Studio (for Android emulator) or a physical Android device
- For iOS development: Xcode on macOS

If you plan to use the dev-client workflow, install the native build once with `npm run android` (or follow Expo docs for iOS) before using `--dev-client`.

## Tips

- Use the following cmd to upload to android emulator ()

  ```bash
  cd "$env:LOCALAPPDATA\Android\Sdk\platform-tools"
  adb push "C:\path\to\your\file.pdf" /sdcard/Download/filename.pdf
  ```
