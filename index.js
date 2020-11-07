const { app, BrowserWindow, ipcMain } = require('electron')
const bodyParser = require('body-parser')
const xlsx = require('xlsx')
const express = require('express')
const expressapp = express();
var resData = {};
var excelList = [];

let mainWindow
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })

    mainWindow.loadFile('index.html')
    mainWindow.webContents.openDevTools()
}

// app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

app.on('ready', () => {
    createWindow();
})

expressapp.use(bodyParser.json());
expressapp.use(bodyParser.urlencoded({
    limit: '150mb',
    extended: false,
}));

ipcMain.on('form-submission', function (event, files) {
    console.log(files)
    const workbook = xlsx.readFile(files);
    const sheetnames = Object.keys(workbook.Sheets);
    let i = sheetnames.length;
    while (i--) {
        const sheetname = sheetnames[i];
        resData[sheetname] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetname]);
    }
    // excelList = Object.values(JSON.parse(JSON.stringify(resData)))
    excelList = eval('('+JSON.stringify(resData)+')');
    console.log(excelList);
    mainWindow.webContents.send('form-received', resData);
});

ipcMain.on('number-submission', function(event, number){
    console.log(number);
    var rand = excelList[Math.floor(Math.random() * excelList.size)];
    console.log(rand);
});