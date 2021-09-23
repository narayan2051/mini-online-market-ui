## ✒️ Overview

The aim of this document is to guide developers to create a cross-platform desktop app using `electron` built upon `react`.

#### 🧐 What packages does the project use?

**`electron`** enables you to create desktop applications with pure JavaScript by providing a runtime with rich native (operating system) APIs. You could see it as a variant of the Node.js runtime that is focused on desktop applications instead of web servers.

**`electron-builder`** is used as a complete solution to package and build a ready for distribution (supports Numerous target formats) Electron app with "auto update" support out of the box.

**`electron-serve`** is used for Static file serving for Electron apps.

**`react`** is a JavaScript library for building user interfaces.

**`concurrently`** is used to run multiple commands concurrently.

**`wait-on`** is used as it can wait for sockets, and http(s) resources to become available.
<br />

## 🚀 Getting Started

**Note:** If you wish to use yarn over npm then modify `package.json` by replacing `npm` with `yarn` in `electron-dev` and `preelectron-pack` scripts.
We will use `npm` as a default package manager.

### 💫 Setup For Electron (Dependencies and Scripts)

#### 1) Switch to project directory

```bash
$ cd <directory>
```

#### 2) Install Development Dependencies

```bash
$ npm i -D electron electron-builder wait-on concurrently
# yarn add --dev electron electron-builder wait-on concurrently
```

#### 3) Install Production Dependency

```bash
$ npm i electron-serve # or yarn add electron-serve
```

#### 4) Your dependencies should look something like this

```json
"dependencies": {
  "electron-serve": "^1.0.0"
},
"devDependencies": {
  "concurrently": "^5.3.0",
  "electron": "^10.0.1",
  "electron-builder": "^22.8.0",
  "react": "^16.13.1",
  "react-dom": "^16.13.1",
  "react-scripts": "3.4.3",
  "wait-on": "^5.2.0"
}
```

#### 5) Create .env file

Directly create a file from IDE or use following commands in bash. File must be in the root of the working directory (project directory).

```bash
# Windows Users
$ fsutil file createnew .env 0
# notepad .env

# Linux and macOS Users
$ touch .env
```

#### 6) Paste this in .env file

```bash
# This suppresses auto-opening `localhost:3000` on the browser
BROWSER=none
```

#### 7) Create electron.js file (serves as entry point for Electron App's Main Process)

Directly create a file from IDE or use following commands in bash. File must be in the root of the working directory (project directory).

```bash
# Windows Users
$ fsutil file createnew electron.js 0
# notepad electron.js

# Linux and macOS Users
$ touch electron.js
```

#### 8) Paste the below code in electron.js file

```js
// Modules to control application life and create native browser window
const { app, BrowserWindow } = require("electron");
const path = require("path");
const serve = require("electron-serve");
const loadURL = serve({ directory: "build" });

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function isDev() {
  return !app.isPackaged;
}

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
    },
    icon: isDev()
      ? path.join(process.cwd(), "public/logo512.png")
      : path.join(__dirname, "build/logo512.png"),
    show: false,
  });

  // This block of code is intended for development purpose only.
  // Delete this entire block of code when you are ready to package the application.
  if (isDev()) {
    mainWindow.loadURL("http://localhost:3000/");
  } else {
    loadURL(mainWindow);
  }

  // Uncomment the following line of code when app is ready to be packaged.
  // loadURL(mainWindow);

  // Open the DevTools and also disable Electron Security Warning.
  // process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = true;
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on("closed", function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  // Emitted when the window is ready to be shown
  // This helps in showing the window gracefully.
  mainWindow.once("ready-to-show", () => {
    mainWindow.setMenuBarVisibility(false);
    mainWindow.show();
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
```

#### 9) Update the script section of `package.json`

```bash
# Add this scripts
"electron": "wait-on http://localhost:3000 && electron .",
"electron-dev": "concurrently \"npm start\" \"npm run-script electron\"",
"preelectron-pack": "npm run-script build",
"electron-pack": "electron-builder"

# You should end up with something similar
"scripts": {
  "start": "react-scripts start",
  "build": "react-scripts build",
  "test": "react-scripts test",
  "electron": "wait-on http://localhost:3000 && electron .",
  "electron-dev": "concurrently \"npm start\" \"npm run-script electron\"",
  "preelectron-pack": "npm run-script build",
  "electron-pack": "electron-builder"
}
```

#### 10) Add the following configuration in `package.json`

**Note:** build configuration is used by electron-builder, modify it if you wish to add more packaging and native distribution options for different OS Platforms.

```bash
"main": "electron.js",  # Application Entry Point, please verify entry point is set to electron.js
"build": {
  "icon": "public/logo512.png",
  "productName": "App Name",
  "files": [
    "build/**/*",
    "electron.js"
  ],
  "extraMetadata": {
    "main": "electron.js"
  },
  "win": {},  # Windows Specific Configuration
  "linux": {},  # Linux Specific Configuration
  "mac": {}  # MacOs Specific Configuration
}
```

### HMIS app specific set up

This is application specific setup. This is required because electron is not supporting cookie write and read. Once we will get any kind of solution regarding cookies, this step will be removed.

```bash
#Open api.js change the API URL to local. Go to line number 18 replace DEV_CONSTANTS with LOCAL_CONSTANTS;

const BASE_URL = LOCAL_CONSTANTS.BASE_URL;

# Open Login.js file and replace with the following line after login success callback. Replace the line(55: !userRole && jsondata.data && Cookies.writeCookie(USER_ROLE, jsondata.data, 6 * 24))


!userRole && jsondata.data && SessionStorage.setItem(USER_ROLE, jsondata.data);

# Open appUtils.js and modify getUserRole() function. replace return Cookies.readCookie(USER_ROLE); with return SessionStorage.getItem(USER_ROLE);
#Now getUserRole function become:

getUserRole() {
  return SessionStorage.getItem(USER_ROLE);
},

```

### Test drive your app

```bash
# Run your app
$ npm run-script electron-dev # or yarn run electron-dev

# Package Your App
$ npm run-script electron-pack # or yarn run electron-pack
```

### References

- [Code Fusion Documentation](https://docs.google.com/document/d/1o53petloqRCEYEMMIUIzQ7Da5c9RNMJNThrf1SKqcGo)
- [create-react-electron-app](https://github.com/soulehshaikh99/create-react-electron-app)
- [electron serve](https://github.com/sandy100/electron-serve)
- [Electron Js Documentation](https://www.electronjs.org/docs)
