//@ts-check

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    const vscode = acquireVsCodeApi();

    window.addEventListener('message', event => {
        const message = event.data; 
        if(message.command=='refactor'){
            let img = document.createElement('img');
        
            img.src = message.text; 
            document.body.appendChild(img);
        }
    });
}());


