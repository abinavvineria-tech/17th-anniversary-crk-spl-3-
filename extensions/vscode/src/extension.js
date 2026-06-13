const vscode = require('vscode');
const { exec } = require('child_process');
const path = require('path');

function activate(context) {
  console.log('🌸 PureLily 17 extension activated!');
  console.log('🍪 Welcome to the Cookie Kingdom!');

  const runFileCommand = vscode.commands.registerCommand('lily.runFile', () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const document = editor.document;
    const filePath = document.uri.fsPath;

    vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: '🌸 Running PureLily 17...',
      cancellable: false
    }, () => {
      return new Promise((resolve, reject) => {
        exec(`lily run "${filePath}"`, (error, stdout, stderr) => {
          if (error) {
            vscode.window.showErrorMessage(`❌ Run failed: ${error.message}`);
            reject(error);
            return;
          }

          const outputChannel = vscode.window.createOutputChannel('PureLily 17');
          outputChannel.clear();
          outputChannel.appendLine('🌸 PureLily 17 Output:');
          outputChannel.appendLine('='.repeat(40));
          outputChannel.append(stdout);
          if (stderr) outputChannel.append(stderr);
          outputChannel.show();

          vscode.window.showInformationMessage('🌸 PureLily 17 program completed!');
          resolve();
        });
      });
    });
  });

  const openEncyclopediaCommand = vscode.commands.registerCommand('lily.openEncyclopedia', () => {
    const panel = vscode.window.createWebviewPanel(
      'cookieEncyclopedia',
      '📖 Cookie Encyclopedia',
      vscode.ViewColumn.One,
      { enableScripts: true }
    );

    panel.webview.html = getEncyclopediaHTML();
  });

  const createProjectCommand = vscode.commands.registerCommand('lily.createProject', () => {
    vscode.window.showInputBox({
      prompt: '🌸 Enter your PureLily 17 project name',
      placeHolder: 'my-cookie-kingdom'
    }).then(name => {
      if (!name) return;

      vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: '🌸 Creating PureLily 17 project...',
        cancellable: false
      }, () => {
        return new Promise((resolve) => {
          exec(`lily new "${name}"`, { cwd: vscode.workspace.rootPath }, (error, stdout) => {
            if (error) {
              vscode.window.showErrorMessage(`❌ Failed to create project: ${error.message}`);
            } else {
              vscode.window.showInformationMessage(`🌸 PureLily 17 project '${name}' created!`);
              const uri = vscode.Uri.file(path.join(vscode.workspace.rootPath || '', name));
              vscode.commands.executeCommand('vscode.openFolder', uri);
            }
            resolve();
          });
        });
      });
    });
  });

  const showTimelineCommand = vscode.commands.registerCommand('lily.showTimeline', () => {
    const panel = vscode.window.createWebviewPanel(
      'timekeeperTimeline',
      '⏳ Timekeeper Timeline',
      vscode.ViewColumn.One,
      { enableScripts: true }
    );

    panel.webview.html = getTimelineHTML();
  });

  const formatDocumentCommand = vscode.commands.registerCommand('lily.formatDocument', () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const document = editor.document;
    vscode.commands.executeCommand('editor.action.formatDocument');
  });

  const buildProjectCommand = vscode.commands.registerCommand('lily.buildProject', () => {
    vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: '🏰 Building PureLily 17 project...',
      cancellable: false
    }, () => {
      return new Promise((resolve) => {
        exec('lily build', { cwd: vscode.workspace.rootPath }, (error, stdout, stderr) => {
          if (error) {
            vscode.window.showErrorMessage(`❌ Build failed: ${error.message}`);
          } else {
            const outputChannel = vscode.window.createOutputChannel('PureLily 17');
            outputChannel.clear();
            outputChannel.append(stdout);
            outputChannel.show();
            vscode.window.showInformationMessage('🏰 PureLily 17 build complete!');
          }
          resolve();
        });
      });
    });
  });

  const runTestsCommand = vscode.commands.registerCommand('lily.runTests', () => {
    vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: '🧪 Running PureLily 17 tests...',
      cancellable: false
    }, () => {
      return new Promise((resolve) => {
        exec('lily test', { cwd: vscode.workspace.rootPath }, (error, stdout, stderr) => {
          const outputChannel = vscode.window.createOutputChannel('PureLily 17 Tests');
          outputChannel.clear();
          outputChannel.append(stdout || stderr);
          outputChannel.show();
          if (error) {
            vscode.window.showErrorMessage('❌ Some tests failed');
          } else {
            vscode.window.showInformationMessage('🧪 All PureLily 17 tests passed!');
          }
          resolve();
        });
      });
    });
  });

  context.subscriptions.push(
    runFileCommand,
    openEncyclopediaCommand,
    createProjectCommand,
    showTimelineCommand,
    formatDocumentCommand,
    buildProjectCommand,
    runTestsCommand
  );

  startLSP(context);
}

function startLSP(context) {
  const config = vscode.workspace.getConfiguration('purelily');
  if (!config.get('lsp.enabled', true)) return;

  const serverModule = context.asAbsolutePath(path.join('../../src/lsp/server.js'));

  try {
    const serverOptions = {
      run: { module: serverModule, transport: vscode.TransportKind.pipe },
      debug: { module: serverModule, transport: vscode.TransportKind.pipe }
    };

    const clientOptions = {
      documentSelector: [{ scheme: 'file', language: 'purelily' }],
      synchronize: {
        configurationSection: 'purelily'
      }
    };

    const client = new vscode.LanguageClient(
      'purelily-lsp',
      'PureLily 17 Language Server',
      serverOptions,
      clientOptions
    );

    client.start();

    context.subscriptions.push(client);
  } catch (e) {
    console.log('LSP client not available (running in basic mode)');
  }
}

function getTimelineHTML() {
  return `<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: 'Segoe UI', sans-serif; background: #0A001A; color: #C0B0E0; padding: 20px; }
  h1 { color: #8B5CF6; text-align: center; }
  .timeline { position: relative; max-width: 600px; margin: 0 auto; }
  .timeline::after { content: ''; position: absolute; width: 2px; background: #8B5CF6; top: 0; bottom: 0; left: 50%; }
  .event { padding: 10px 40px; position: relative; width: 50%; box-sizing: border-box; }
  .event::after { content: '⏳'; position: absolute; right: -17px; top: 15px; font-size: 20px; }
  .year { color: #8B5CF6; font-size: 24px; font-weight: bold; }
  .desc { margin: 5px 0; }
  .right { left: 50%; }
  .right::after { left: -17px; }
</style>
</head>
<body>
  <h1>⏳ Timekeeper Timeline</h1>
  <div class="timeline">
    <div class="event"><div class="year">2009</div><div class="desc">OvenBreak begins</div></div>
    <div class="event right"><div class="year">2013</div><div class="desc">Cookie Run: OvenBreak</div></div>
    <div class="event"><div class="year">2016</div><div class="desc">LINE Cookie Run</div></div>
    <div class="event right"><div class="year">2019</div><div class="desc">Cookie Run: Kingdom</div></div>
    <div class="event"><div class="year">2021</div><div class="desc">Cookie Run: OvenBreak 2</div></div>
    <div class="event right"><div class="year">2026</div><div class="desc">🌸 PureLily 17</div></div>
  </div>
</body>
</html>`;
}

function getEncyclopediaHTML() {
  return `<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: 'Segoe UI', sans-serif; background: #FFF8E7; color: #4A3728; padding: 20px; }
  h1 { color: #D4AF37; text-align: center; }
  .cookie-card { background: white; border: 1px solid #E8D5B5; border-radius: 8px; padding: 15px; margin: 10px 0; }
  .cookie-name { color: #D4AF37; font-weight: bold; font-size: 18px; }
  .cookie-type { color: #8A7A6A; font-size: 12px; }
  .cookie-lore { margin-top: 8px; }
</style>
</head>
<body>
  <h1>📖 Cookie Encyclopedia 📖</h1>
  <div class="cookie-card">
    <div class="cookie-name">🍦 Pure Vanilla Cookie</div>
    <div class="cookie-type">Ancient Cookie - Healer</div>
    <div class="cookie-lore">The ancient hero of the Cookie Kingdom, blessed with pure healing light.</div>
  </div>
  <div class="cookie-card">
    <div class="cookie-name">🌿 White Lily Cookie</div>
    <div class="cookie-type">Ancient Cookie - Scholar</div>
    <div class="cookie-lore">The brilliant scholar and keeper of ancient knowledge.</div>
  </div>
  <div class="cookie-card">
    <div class="cookie-name">🍇 Hollyberry Cookie</div>
    <div class="cookie-type">Ancient Cookie - Tank</div>
    <div class="cookie-lore">The fearless queen of the Hollyberry Kingdom.</div>
  </div>
</body>
</html>`;
}

function deactivate() {}

module.exports = { activate, deactivate };
