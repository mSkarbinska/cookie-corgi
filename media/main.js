//@ts-check

let IDLE_CORGI ="";

let SLEEPING_CORGI = "";

let LOVING_CORGI ="";

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    const vscode = acquireVsCodeApi();
    let img = document.createElement('img');

    window.addEventListener('message', event => {
        const message = event.data; 

        switch(message.command){
            case 'showCorgi':{
                IDLE_CORGI = message.text;
                img.src = IDLE_CORGI; 
                img.className = "corgi";
                img.addEventListener('click', () => {
                    vscode.postMessage({type: 'pet'});
                });
                document.body.appendChild(img);
                break;
            }
            case 'setSleepingCorgi':{
                SLEEPING_CORGI = message.text;
                setInterval(function(){
                    img.src = isSleepTime() ? SLEEPING_CORGI : IDLE_CORGI;
                },3000);
                break;
            }
            case 'pet':{
                let img = document.querySelector('img');
                LOVING_CORGI = message.text;
                img.src = LOVING_CORGI;
                setTimeout(() => {
                    img.src = IDLE_CORGI;
                }, 1000);

                break;
            }
    }
    });
}());

function isSleepTime() {
    let now = new Date();
    let hour = now.getHours();
    return hour >= 23 || hour <= 7;
}