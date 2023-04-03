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

    // cookie
    let cookie = document.createElement('img');
    cookie.className = "cookie";
    cookie.draggable = true;
    cookie.src = COOKIE;
    
    cookie.ondragstart = (event) => {
        event.dataTransfer.setData('text/plain', 'cookie');
        event.dataTransfer.dropEffect = 'none';
        event.target.style.cursor = 'grab';
    };

    document.body.appendChild(cookie);

    // corgi
    let corgi = document.createElement('img');
    corgi.id="corgi";
    corgi.src = IDLE_CORGI; 
    document.body.appendChild(corgi);
    
    corgi.addEventListener('click', () => {
        vscode.postMessage({type: 'pet'});
    });
    corgi.ondragover = (event) => {
        event.preventDefault();
    };
    corgi.ondrop = (event) => {
        event.preventDefault();
        vscode.postMessage({type: 'chomp'});
    };

    // prevent default when dragging cookie over background
    document.body.ondragover = (event) => {
        event.preventDefault();
    };

    window.addEventListener('message', event => {
        const message = event.data; 

        switch(message.command){
            case 'showCorgi':{
                IDLE_CORGI = message.text;
                vscode.setState({...previousState, IDLE_CORGI});
                corgi.src = IDLE_CORGI;
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
                LOVING_CORGI = message.text;
                vscode.setState({...previousState, LOVING_CORGI});
                corgi.src = LOVING_CORGI;
                setTimeout(() => {
                    corgi.src = IDLE_CORGI;
                }, 1000);

                break;
            }
            case 'sleep':{
                SLEEPING_CORGI = message.text;
                vscode.setState({...previousState, SLEEPING_CORGI});
                corgi.src = SLEEPING_CORGI;
                break;
            }
            case 'wake':{
                IDLE_CORGI = message.text;
                vscode.setState({...previousState, IDLE_CORGI});
                corgi.src = IDLE_CORGI;
                break;
            }
            case 'chomp':{
                CHOMPING_CORGI = message.text;
                vscode.setState({...previousState, CHOMPING_CORGI});
                corgi.src = CHOMPING_CORGI;
                setTimeout(() => {
                    corgi.src = IDLE_CORGI;
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
    return hour >=23 || hour <= 7;
}