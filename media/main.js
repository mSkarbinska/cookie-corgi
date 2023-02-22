//@ts-check

let IDLE_CORGI ="";
let SLEEPING_CORGI = "";
let LOVING_CORGI ="";

let COOKIE = "";

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    const vscode = acquireVsCodeApi();

    let cookie = document.createElement('img');
    cookie.className = "cookie";
    cookie.draggable = true;
    document.body.appendChild(cookie);

    let corgi = document.createElement('img');
    corgi.className = "corgi";
    corgi.ondragleave = function(event) {
        event.preventDefault();
        console.log("chomp");
    };
    document.body.appendChild(corgi);

    window.addEventListener('message', event => {
        const message = event.data; 

        switch(message.command){
            case 'showCorgi':{
                IDLE_CORGI = message.text;
                corgi.src = IDLE_CORGI; 
                corgi.id="corgi";
                corgi.addEventListener('click', () => {
                    vscode.postMessage({type: 'pet'});
                });
                break;
            }
            case 'setSleepingCorgi':{
                SLEEPING_CORGI = message.text;
                setInterval(function(){
                    corgi.src = isSleepTime() ? SLEEPING_CORGI : IDLE_CORGI;
                },3000);
                break;
            }
            case 'pet':{
                let img = document.getElementById('corgi');
                LOVING_CORGI = message.text;
                img.src = LOVING_CORGI;
                setTimeout(() => {
                    img.src = IDLE_CORGI;
                }, 1000);

                break;
            }
            case 'setCookie':{
                COOKIE = message.text;
                cookie.src = COOKIE;
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