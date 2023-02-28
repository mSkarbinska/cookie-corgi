//@ts-check

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    
    const vscode = acquireVsCodeApi();
    const previousState = vscode.getState();

    let IDLE_CORGI = previousState?.IDLE_CORGI ?? "";
    let SLEEPING_CORGI = previousState?.SLEEPING_CORGI ?? "";
    let LOVING_CORGI = previousState?.LOVING_CORGI ?? "";
    let CHOMPING_CORGI = previousState?.CHOMPING_CORGI ?? "";

    let COOKIE = previousState?.COOKIE ?? "";

    let cookie = document.createElement('img');
    cookie.className = "cookie";
    cookie.draggable = true;
    cookie.src = COOKIE;

    let corgi = document.createElement('img');
    corgi.id="corgi";
    corgi.src = IDLE_CORGI; 

    document.body.appendChild(cookie);
    document.body.appendChild(corgi);

    corgi.addEventListener('click', () => {
        vscode.postMessage({type: 'pet'});
    });

    corgi.ondragleave = (event) => {
        event.preventDefault();
        vscode.postMessage({type: 'chomp'});
    };
    
    window.addEventListener('message', event => {
        const message = event.data; 

        switch(message.command){
            case 'showCorgi':{
                IDLE_CORGI = message.text;
                vscode.setState({...previousState, IDLE_CORGI});
                break;
            }
            case 'setSleepingCorgi':{
                SLEEPING_CORGI = message.text;
                vscode.setState({...previousState, SLEEPING_CORGI});
                setInterval(function(){
                    corgi.src = isSleepTime() ? SLEEPING_CORGI : IDLE_CORGI;
                },3000);
                break;
            }
            case 'pet':{
                let img = document.getElementById('corgi');
                LOVING_CORGI = message.text;
                vscode.setState({...previousState, LOVING_CORGI});
                img.src = LOVING_CORGI;
                setTimeout(() => {
                    img.src = IDLE_CORGI;
                }, 1000);

                break;
            }
            case 'chomp':{
                let img = document.getElementById('corgi');
                CHOMPING_CORGI = message.text;
                img.src = CHOMPING_CORGI;
                setTimeout(() => {
                    img.src = IDLE_CORGI;
                }, 1000);
                break;
            }
            case 'setCookie':{
                COOKIE = message.text;
                vscode.setState({...previousState, COOKIE});
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