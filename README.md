# HMIS - Health Management Information System.

Health Management Information System Module For Samyantra.

## Installation
- Clone the repository in your terminal by clicking the _green_ clone button at the top right and copy the url
- In your terminal, type ```git clone URL```
  - replace URL with the url you copied
  - hit enter
- This will copy all the files from this repo down to your computer
- In your terminal, cd into the directory you just created
- Type ```npm install``` to install all dependencies
- Last, but not least, type ```npm start``` to run the app locally.
- To look at the code, just open up the project in your favorite code editor!

## Project Structure

HMIS directories and files for UI:

```
HMIS-UI
.
├── README.md
├── CHANGELOG-0.x.md
├── package-lock.json
├── package.json
├── .gitignore
├── config
│   ├── jest
│   │   ├── cssTransform.js
│   │   ├── fileTransform.js
│   ├── env.js
│   ├── modules.js
│   └── paths.js
│   └── pnpTs.js
│   └── webpack.config.js
│   └── webpackDevServer.config.js
├── public
│   └── favicon.ico
│   └── index.html
│   └── logo192.png
│   └── logo512.png
│   └── manifest.json
│   └── robots.txt
├── scripts
│   └── build.js
│   └── start.js
│   └── test.js
└── src
    ├── App.js
    ├── index.js
    ├── serviceWorker.js
    ├── api
    │   ├── api.js
    │
    ├── assets
    │   ├── img
    │   │   ├── logo.png
    │   │   ├── nepal-government-logo.png
    │   │
    │   └── scss
    │       ├── core
    │       │     ├── _base.scss
    │       │     ├── _mixins.scss
    │       │     ├── _variables.scss
    │       │  
    │       ├── plugins
    │       └── app.scss
    ├── components
    │   ├── add-user
    │   │   └── AddUserModal.js
    │   │   └── style.js
    │   ├── alert
    │   │   └── Alert.js
    │   ├── charts
    │   │   └── BarDiagram.js
    │   │   └── PieChart.js
    │   ├── custom-select
    │   │   └── CustomSelect.js
    │   │   └── style.js
    │   ├── empty-container
    │   │   └── EmptyContainer.js
    │   ├── footer
    │   │   └── Footer.js
    │   │   └── style.js
    │   ├── header
    │   │   └── Header.js
    │   │   └── style.js
    │   ├── layout
    │   │   └── Layout.js
    │   │   └── style.js
    │   ├── loader
    │   │   └── Loader.js
    │   │   └── style.js
    │   ├── message-block
    │   │   └── MessageBlock.js
    │   │   └── style.js
    │   ├── modal
    │   │   └── CustomModal.js
    │   │   └── style.js
    │   ├── nepali-datepicker
    │   │   └── NepaliDatePicker.js
    │   │   └── style.js
    │   ├── scroll-to-top
    │   │   └── ScrollToTop.js
    │   │   └── style.js
    │  
    ├── context
    │   ├── LayoutContext.js
    │   ├── UserContext.js
    │
    ├── misc
    │   ├── AppMisc.js
    │
    ├── pages
    │   ├── admin
    │   │   ├──
    │   │   ├──
    │   │   └──
    │   ├── forms
    │   │   ├──
    │   │   ├──
    │   │   └──
    │   ├── public
    │   │   ├──
    │   │   ├──
    │   │  
    │   ├── user
    │   │   ├──
    │   │   ├──
    │   │  
    │
    ├── routes
    │   ├── Route.js
    │
    ├── services
    │   ├── history.js
    │
    ├── themes
    │   ├── default.js
    │   ├── index.js
    │
    └── utils
        ├── constants
        │   ├── forms
        │   │   └── index.je
        │   │
        │   └── index.js
        │
        ├── storage
        │       ├── cookies.js
        │       ├── localStorage.js
        │       └── sessionStorage.js
        │
        │── appUtils.js
        └── dateUtils.js


```

#### Building for source

For development release:
  - Change `BASE_URL` in the `api.js` file to `DEV_CONSTANTS.BASE_URL`

```sh
$ npm run-script build
```
For production release:
  - Change `BASE_URL` in the `api.js` file to `PROD_CONSTANTS.BASE_URL`

```sh
$ npm run-script build
```