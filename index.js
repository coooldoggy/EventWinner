const { app, BrowserWindow, ipcMain } = require('electron')
const bodyParser = require('body-parser')
const xlsx = require('xlsx')
const express = require('express')
const expressapp = express();
var resData = {};
var excelList = [];
var eventList = [];

let mainWindow
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 700,
        webPreferences: {
            nodeIntegration: true
        }
    })

    mainWindow.loadFile('index.html')
    // mainWindow.webContents.openDevTools()
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

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
    excelList = Object.values(JSON.parse(JSON.stringify(resData)))
    for (var j = 0; j < excelList.length; j++) {
        var counter = excelList[j];
        for (var k = 0; k < counter.length; k++) {
            var item = counter[k];
            eventList.push(item);
        }
    }
    mainWindow.webContents.send('form-received', resData);
});

ipcMain.on('number-submission', function (event, number) {
    console.log(number);
    mainWindow.webContents.send('clear-list', number);
    while (number--) {
        var rand = getRndInteger(0, eventList.length);
        mainWindow.webContents.send('winner-selected', eventList[rand]);
    }
});