const ipcRenderer = require('electron').ipcRenderer;
const responseParagraph = document.getElementById('response');
const winnerList = document.getElementById('winnerList');
const winner = document.getElementById('winner');

function sendForm(event) {
    event.preventDefault();
    let files = document.getElementById("files").files[0].path;
    ipcRenderer.send('form-submission', files)
}

ipcRenderer.on('form-received', function (event, args) {
    responseParagraph.innerHTML = JSON.stringify(args)
});

function sendNumber(event) {
    event.preventDefault();
    let number = document.getElementById("number").value;
    ipcRenderer.send('number-submission', number)
}

/**
 * 당첨자 리스트 생성
 */
ipcRenderer.on('winner-selected', function (event, args) {
    var li = document.createElement('li');
    li.appendChild(document.createTextNode(JSON.stringify(args)));
    winnerList.appendChild(li);
});

/**
 * excel 다운로드 버튼 생성
 */
ipcRenderer.on('create-downloadbtn', function (event, args) {
    var a = document.createElement('a');
    a.appendChild(document.createTextNode("다운로드"))
    a.href = "";
    winner.appendChild(a);
});

ipcRenderer.on('clear-list', function (event, args) {
    while (winnerList.hasChildNodes()) {
        winnerList.removeChild(winnerList.firstChild);
    }
    winner.removeChild(winner.firstChild);
});