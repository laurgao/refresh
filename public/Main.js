// include the Node.js "path" module at the top of your file
const path = require("path")

const { app, BrowserWindow } = require("electron")

function createWindow() {
    const win = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                preload: path.join(__dirname, "preload.js") // gets preload.js
            }
        })
        // win.webContents.openDevTools() ctrl+shift+i does the job.

    // win.loadFile("public/index.html")
    // win.loadURL('http://localhost:3000/')
    win.loadURL(`file://${path.join(__dirname, '../build/index.html')}`)

    globalShortcut.register('f5', function() {
        console.log('f5 is pressed')
        mainWindow.reload()
    })
    globalShortcut.register('CommandOrControl+R', function() {
        console.log('CommandOrControl+R is pressed')
        mainWindow.reload()
    })

}

app.on("window-all-closed", function() {
    if (process.platform !== "darwin") app.quit()
        // listen for the app module"s "window-all-closed" event, and call [app.quit()][app-quit] if the user is not on macOS (darwin).
        // https://www.electronjs.org/docs/tutorial/quick-start#manage-your-windows-lifecycle
})

// For mac
app.whenReady().then(() => {
    createWindow()

    app.on("activate", function() {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
}).catch((e) => (
    console.log(e)
))