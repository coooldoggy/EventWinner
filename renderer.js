const ipcRenderer = require('electron').ipcRenderer;
const responseParagraph = document.getElementById('response');

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