import * as vscode from 'vscode';


export function activate(context: vscode.ExtensionContext) {

	const provider = new CorgiViewProvider(context.extensionUri);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(CorgiViewProvider.viewType, provider));

	context.subscriptions.push(
		vscode.commands.registerCommand('cookieCorgi.pet', () => provider.pet(context.extensionUri))
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('cookieCorgi.chomp', () => provider.chomp(context.extensionUri))
	);
}

class CorgiViewProvider implements vscode.WebviewViewProvider {

	public static readonly viewType = 'cookieCorgi.corgiView';

	private _view?: vscode.WebviewView;


	constructor(
		private readonly _extensionUri: vscode.Uri,
	) { }

	public resolveWebviewView(
		webviewView: vscode.WebviewView,
		context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken,
	) {
		this._view = webviewView;

		webviewView.webview.options = {
			enableScripts: true,
			localResourceRoots: [vscode.Uri.joinPath(this._extensionUri, 'media')],
		};

		webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

		this.setupCorgi(this._extensionUri);

		webviewView.webview.onDidReceiveMessage(data => {
			switch (data.type) {
				case 'pet':
					{
						this.pet(this._extensionUri);
						break;
					}
				case 'chomp':
					{
						this.chomp(this._extensionUri);
						break;
					}
				}
				});
	}

	public setupCorgi(extensionUri: vscode.Uri) {
		const webview = this._view.webview;

		const onDiskPath = vscode.Uri.joinPath(extensionUri, 'media', 'corgi.gif');
		const corgiGifSrc = webview.asWebviewUri(onDiskPath);

		const sleepingCorgiOnDiskPath = vscode.Uri.joinPath(extensionUri, 'media', 'sleeping-corgi.gif');
		const sleepingCorgiGifSrc = webview.asWebviewUri(sleepingCorgiOnDiskPath);

		const cookieOnDiskPath = vscode.Uri.joinPath(extensionUri, 'media', 'whole-cookie.png');
		const cookieGifSrc = webview.asWebviewUri(cookieOnDiskPath);

		this._view.webview.postMessage({ command: 'showCorgi', text:String(corgiGifSrc) });
		this._view.webview.postMessage({ command: 'setSleepingCorgi', text:String(sleepingCorgiGifSrc) });
		this._view.webview.postMessage({ command: 'setCookie', text:String(cookieGifSrc) });
	}

	public pet(extensionUri: vscode.Uri) {
		const webview = this._view.webview;

		const onDiskPath = vscode.Uri.joinPath(extensionUri, 'media', 'loving-corgi.gif');
		const corgiGifSrc = webview.asWebviewUri(onDiskPath);

		this._view.webview.postMessage({ command: 'pet', text: String(corgiGifSrc) });
	}

	public chomp(extensionUri: vscode.Uri) {
		const webview = this._view.webview;

		const onDiskPath = vscode.Uri.joinPath(extensionUri, 'media', 'chomping-corgi.gif');
		const corgiGifSrc = webview.asWebviewUri(onDiskPath);

		this._view.webview.postMessage({ command: 'chomp', text: String(corgiGifSrc) });
	}

	private _getHtmlForWebview(webview: vscode.Webview) {
		const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js'));
		const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.css'));

		// Use a nonce to only allow a specific script to be run.
		const nonce = getNonce();

		return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">

				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
				-->
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}';">

				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleMainUri}" rel="stylesheet">


				<title>Cookie Corgi</title>
			</head>
			<body>
				<script nonce="${nonce}" src="${scriptUri}"></script>

			</body>
			</html>`;
	}
}

function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

