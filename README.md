<h1 align="center">
  <img alt="logo" src="./assets/icon.png" width="124px" style="border-radius:10px"/><br/>RunSquad <br/><br/>
  <a href="https://play.google.com/store/apps/details?id=com.runstarter.development">
    <img alt="google-play" src="https://github.com/qreoct/runstarter/assets/35778042/c85195e4-3430-46b9-88bf-f692543e8c7e" width="180px"/>
  </a>
  <a href="https://testflight.apple.com/join/c4k9Toqf">
    <img alt="testflight" src="https://github.com/qreoct/runstarter/assets/35778042/7fe3946d-9b47-4942-8684-8d1f5c6be032" width="180px"/>
  </a>
</h1>

![react-native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![firebase](	https://img.shields.io/badge/firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black)
![socketio](https://img.shields.io/badge/Socket.io-010101?&style=for-the-badge&logo=Socket.io&logoColor=white)
![tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

# 🏃‍♂️🏆 Turn your Miles into Smiles 🏆🏃‍♀️

Run Squad is not just another running app; it's a dynamic and innovative platform designed to inspire, motivate, and connect runners of all levels to help them achieve their fitness goals. Whether you're a seasoned marathoner or a complete beginner, Run Squad is your virtual running companion that brings a whole new dimension to your fitness journey.

## Team

Run Squad is built by the following developers from NUS School of Computing for CS3216.

#### Dexter ([dexterleng](https://github.com/dexterleng))

#### Kleon ([kleonang](https://github.com/kleonang))

#### Jefferson ([qreoct](https://github.com/qreoct))

#### Joong ([joongeo](https://github.com/joongeo))

---

# 🔗 Development

> This Project is based on [Obytes starter](https://starter.obytes.com)

## Requirements

- [React Native dev environment](https://reactnative.dev/docs/environment-setup)
- [Node.js LTS release](https://nodejs.org/en/)
- [Git](https://git-scm.com/)
- [Watchman](https://facebook.github.io/watchman/docs/install#buildinstall), required only for macOS or Linux users
- [Pnpm](https://pnpm.io/installation)
- [Expo Cli](https://docs.expo.dev/workflow/expo-cli/)
- [VS Code Editor](https://code.visualstudio.com/download) ⚠️ Make sure to install all recommended extension from `.vscode/extensions.json`

## 👋 Quick start

Clone the repo to your machine and install deps :

```sh
git clone https://github.com/qreoct/runstarter

cd ./runstarter

pnpm install
```

Env setup (`.env.development`, `.env.staging`, `.env.production` respectively)

```
EAS_PROJECT_ID=
REACT_APP_IOS_CLIENT_ID=
REACT_APP_ANDROID_CLIENT_ID=

REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
REACT_APP_FIREBASE_MEASUREMENT_ID=
```

To run the app on ios

```sh
pnpm ios
```

To run the app on Android

```sh
pnpm android
```

## ✍️ Documentation

- [Project structure](https://starter.obytes.com/getting-started/project-structure)
