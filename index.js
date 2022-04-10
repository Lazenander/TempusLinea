const { app, ipcMain, BrowserWindow } = require('electron')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        icon: "./res/icon/icon.ico",
    })

    win.loadFile('./html/index.html');
    win.on('resized', () => { win.webContents.send("resize", win.getSize()); })
        //win.webContents.openDevTools();
    ipcMain.on('resizeWin', (event, size) => {
        console.log(size);
        win.setSize(size[0], size[1]);
    });
}

app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0)
            createWindow();
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})