const ipcRenderer = require('electron').ipcRenderer;
const responseParagraph = document.getElementById('response');
const winnerList = document.getElementById('winnerList');

function sendForm(event) {
    event.preventDefault();
    let files = document.getElementById("files").files[0].path; 
    ipcRenderer.send('form-submission', files)
}

ipcRenderer.on('form-received', function(event, args){
    responseParagraph.innerHTML = JSON.stringify(args)
});

function sendNumber(evnet){
    event.preventDefault();
    let number = document.getElementById("number").value; 
    ipcRenderer.send('number-submission', number)
}

ipcRenderer.on('winner-selected', function(event, args){
    var li = document.createElement('li');
    li.appendChild(document.createTextNode(JSON.stringify(args)));
    winnerList.appendChild(li);
});