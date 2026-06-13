const { CodeActionKind, DiagnosticSeverity } = require('vscode-languageserver/node');

class LilyRefactorer {
  provideCodeActions(params, ast, documentsMap) {
    const actions = [];
    const uri = params.textDocument.uri;
    const range = params.range;
    const diagnostics = params.context.diagnostics;

    for (const diag of diagnostics) {
      if (diag.source === 'lily-type-checker') {
        actions.push({
          title: `🔧 Fix: ${diag.message}`,
          kind: CodeActionKind.QuickFix,
          diagnostics: [diag],
          isPreferred: true,
          edit: {
            changes: {
              [uri]: [{
                range: diag.range,
                newText: '// TODO: Fix this'
              }]
            }
          }
        });
      }

      if (diag.message.includes('already defined')) {
        actions.push({
          title: '🔧 Rename to unique identifier',
          kind: CodeActionKind.QuickFix,
          diagnostics: [diag],
          edit: {
            changes: {
              [uri]: [{
                range: diag.range,
                newText: ''
              }]
            }
          }
        });
      }
    }

    actions.push({
      title: '📦 Extract to function',
      kind: CodeActionKind.RefactorExtract,
      range: range
    });

    actions.push({
      title: '📦 Extract to variable',
      kind: CodeActionKind.RefactorExtract,
      range: range
    });

    actions.push({
      title: '📝 Organize imports',
      kind: CodeActionKind.SourceOrganizeImports
    });

    actions.push({
      title: '🎨 Add type annotation',
      kind: CodeActionKind.RefactorRewrite
    });

    actions.push({
      title: '🌸 Convert to match expression',
      kind: CodeActionKind.RefactorRewrite,
      range: range
    });

    actions.push({
      title: '💚 Wrap in friendship block',
      kind: CodeActionKind.RefactorRewrite,
      range: range
    });

    actions.push({
      title: '⏳ Wrap in timeflow block',
      kind: CodeActionKind.RefactorRewrite,
      range: range
    });

    actions.push({
      title: '✨ Add anniversary celebration',
      kind: CodeActionKind.RefactorRewrite,
      range: range
    });

    actions.push({
      title: '🔄 Inline variable',
      kind: CodeActionKind.RefactorInline,
      range: range
    });

    actions.push({
      title: '🏛️ Convert to class method',
      kind: CodeActionKind.RefactorRewrite,
      range: range
    });

    return actions;
  }

  resolveCodeAction(params) {
    return params;
  }

  prepareRename(text, offset, newName, documentsMap) {
    const word = this.getWordAtPosition(text, offset);
    if (!word) return null;

    const changes = {};
    for (const [uri, doc] of documentsMap) {
      const edits = [];
      const lines = doc.text.split('\n');
      const regex = new RegExp(`\\b${word}\\b`, 'g');

      for (let lineNum = 0; lineNum < lines.length; lineNum++) {
        let match;
        while ((match = regex.exec(lines[lineNum])) !== null) {
          edits.push({
            range: {
              start: { line: lineNum, character: match.index },
              end: { line: lineNum, character: match.index + word.length }
            },
            newText: newName
          });
        }
      }

      if (edits.length > 0) {
        changes[uri] = edits;
      }
    }

    return { changes };
  }

  canRename(text, offset) {
    const word = this.getWordAtPosition(text, offset);
    if (!word) return null;

    const lines = text.split('\n');
    const pos = text.slice(0, offset).split('\n').length - 1;

    return {
      start: { line: pos, character: offset - text.slice(0, offset).split('\n').pop().length },
      end: { line: pos, character: offset - text.slice(0, offset).split('\n').pop().length + word.length }
    };
  }

  getWordAtPosition(text, offset) {
    if (offset >= text.length) return '';
    let start = offset;
    let end = offset;
    while (start > 0 && /[a-zA-Z0-9_]/.test(text[start - 1])) start--;
    while (end < text.length && /[a-zA-Z0-9_]/.test(text[end])) end++;
    return text.slice(start, end);
  }
}

module.exports = { LilyRefactorer };
