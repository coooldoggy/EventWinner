const fileInput = document.getElementById('files');

const handelFileSelect = event => {
    const files = event.target.files;
    for (let file of files) {
        if (!file.type.match('officedocument.*')) {
            continue;
        }

        window.postMessage({
            type: 'file-added',
            data: file.path
        }, '*');
    }
    event.preventDefault();
    event.stopPropagation();
}

fileInput.addEventListener('change', handelFileSelect);