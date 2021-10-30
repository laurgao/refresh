# Refresh

Refresh is a desktop app built with Electron.js and React.js as well as a webapp on [takebreaks.vercel.app](https://takebreaks.vercel.app).

To get a development version of Refresh running,

1. Clone this repo
2. `cd refresh && npm i`
3. `npm start` to open [http://localhost:3000](http://localhost:3000) that can be viewed in browser.
4. `npm run electron-start` to open the desktop app in development mode that uses contents from `localhost:3000`.

To build a Refresh installer, use `npm run electron-pack` in the root directory. The `.exe` will be outputted into a `dist` folder.
