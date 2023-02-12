//@ts-check

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    const vscode = acquireVsCodeApi();

    window.addEventListener('message', event => {
        const message = event.data; 
        
    switch(message.command){
        case 'showCorgi':
            {
                let img = document.createElement('img');
                img.src = message.text; 
                img.className = "corgi";

                img.addEventListener('click', () => {
                    vscode.postMessage({type: 'pet'});
                });

                document.body.appendChild(img);
                break;
            }
        case 'pet':
            {
                let img = document.querySelector('img');
                let oldSrc = img.src;
                img.src = message.text;

                setTimeout(() => {
                    img.src = oldSrc;
                }, 1000);

                break;
            }
    }
    });
}());


