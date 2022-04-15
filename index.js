const { app, ipcMain, dialog, globalShortcut, BrowserWindow } = require('electron')
const fs = require('fs');

let edited = false;
let filePath = "";
let shouldClose = false;

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
    win.setMenu(null);
    win.on('resized', () => { win.webContents.send("resize", win.getSize()); })
    win.on('close', (e) => {
        if (shouldClose)
            return;
        shouldClose = true;
        e.preventDefault();
        if (edited) {
            dialog.showMessageBox(win, {
                type: 'question',
                buttons: ['保存 Save', '不保存 Don\'t Save', '取消 Cancel'],
                defaultId: 0,
                title: '保存修改？Save changes?',
                message: '你希望保存文档修改吗？Do you want to save the changes you made in the document?',
                detail: '如果不保存，您的文档信息会丢失。Your changes will be lost if you don\'t save them.'
            }).then((res) => {
                let buttonIndex = res.response;
                if (buttonIndex == 0)
                    win.webContents.send('closeSaveFile');
                else if (buttonIndex == 1)
                    win.close();
                else
                    shouldClose = false;
            })
        } else
            win.close();
    });
    //win.webContents.openDevTools();
    ipcMain.on('resizeWin', (event, size) => {
        win.setSize(size[0], size[1]);
    });
    ipcMain.on("closeSaveTLfile", (event, arg) => {
            if (filePath == "") {
                dialog.showSaveDialog({
                    properties: ['openFile'],
                    filters: [{ name: '贞元文件 TempusLinea File', extensions: ['tlf'] }]
                }).then(result => {
                    if (result.canceled)
                        return;
                    filePath = result.filePath;
                    fs.writeFileSync(result.filePath, arg, 'utf8');
                    win.close();
                })
            } else {
                fs.writeFileSync(filePath, arg, 'utf8');
                win.close();
            }
        })
        /*globalShortcut.register('CommandOrControl+S', () => {
            win.webContents.send('csSaveFile');
        })*/
}

app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0)
            createWindow();
    })
})

app.on('window-all-closed', () => {
    //if (process.platform !== 'darwin') app.quit()
    app.exit();
})

ipcMain.on('openTLfile', (event, arg) => {
    dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: '贞元文件 TempusLinea File', extensions: ['tlf'] }]
    }).then(result => {
        if (result.canceled)
            return;
        let data = fs.readFileSync(result.filePaths[0], 'utf8');
        filePath = result.filePaths[0];
        event.sender.send('openTLfile', data);
    })
})

ipcMain.on('saveTLfile', (event, arg) => {
    if (filePath == "") {
        dialog.showSaveDialog({
            properties: ['openFile'],
            filters: [{ name: '贞元文件 TempusLinea File', extensions: ['tlf'] }]
        }).then(result => {
            if (result.canceled)
                return;
            filePath = result.filePath;
            fs.writeFileSync(result.filePath, arg, 'utf8');
            event.sender.send("saved");
        })
    } else {
        fs.writeFileSync(filePath, arg, 'utf8');
        event.sender.send("saved");
    }
    edited = false;
})

ipcMain.on('edited', (event, arg) => {
    edited = true;
})