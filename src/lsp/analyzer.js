const { SymbolKind, DiagnosticSeverity } = require('vscode-languageserver/node');

class LilyAnalyzer {
  constructor() {
    this.dependencyGraph = new Map();
    this.completions = new Map();
  }

  checkSyntax(ast, document) {
    const diagnostics = [];
    const text = document.getText();
    const lines = text.split('\n');

    let inBlockComment = false;

    for (let lineNum = 0; lineNum < lines.length; lineNum++) {
      const line = lines[lineNum];

      if (line.includes('(*') && !inBlockComment) {
        inBlockComment = true;
      }
      if (inBlockComment && line.includes('*)')) {
        inBlockComment = false;
        continue;
      }
      if (inBlockComment) continue;

      const stripped = line.trim();
      if (!stripped || stripped.startsWith('//')) continue;

      const openParens = (stripped.match(/\(/g) || []).length;
      const closeParens = (stripped.match(/\)/g) || []).length;

      if (openParens !== closeParens) {
        diagnostics.push({
          severity: DiagnosticSeverity.Error,
          range: {
            start: { line: lineNum, character: 0 },
            end: { line: lineNum, character: line.length }
          },
          message: `Unmatched parentheses: ${openParens} open vs ${closeParens} close`,
          source: 'lily-analyzer'
        });
      }
    }

    return diagnostics;
  }

  semanticAnalysis(ast, document) {
    const diagnostics = [];
    const symbols = new Set();

    for (const node of ast.body) {
      if (node.type === 'VariableDeclaration' || node.type === 'FunctionDeclaration' || node.type === 'ClassDeclaration') {
        if (symbols.has(node.name)) {
          diagnostics.push({
            severity: DiagnosticSeverity.Warning,
            range: {
              start: node.start,
              end: { line: node.start.line, character: node.start.character + node.name.length }
            },
            message: `'${node.name}' is already defined in this scope`,
            source: 'lily-analyzer'
          });
        }
        symbols.add(node.name);
      }
    }

    return diagnostics;
  }

  checkImports(ast, document) {
    const diagnostics = [];

    for (const node of ast.body) {
      if (node.type === 'ImportDeclaration') {
        if (!node.source) {
          diagnostics.push({
            severity: DiagnosticSeverity.Error,
            range: {
              start: node.start,
              end: { line: node.start.line, character: node.start.character + 6 }
            },
            message: 'Import statement requires a module source',
            source: 'lily-analyzer'
          });
        }
      }
    }

    return diagnostics;
  }

  extractDependencies(text) {
    const deps = [];
    const importRegex = /import\s+(?:{[^}]+}|\w+)\s+from\s+"([^"]+)"/g;
    let match;
    while ((match = importRegex.exec(text)) !== null) {
      deps.push(match[1]);
    }
    return deps;
  }

  updateDependencyGraph(uri, deps) {
    this.dependencyGraph.set(uri, deps);
  }

  getCompletionContext(text, offset) {
    const before = text.slice(0, offset);
    const lastDot = before.lastIndexOf('.');
    
    if (lastDot !== -1) {
      const modulePath = before.slice(0, lastDot).split(/[\s\n]/).pop();
      return { type: 'member', module: modulePath, prefix: before.slice(lastDot + 1) };
    }

    const lastSpace = before.trim().lastIndexOf(' ');
    const currentWord = before.slice(lastSpace + 1).trim();
    return { type: 'word', prefix: currentWord };
  }

  getWordAtPosition(text, offset) {
    if (offset >= text.length) return '';
    
    let start = offset;
    let end = offset;

    while (start > 0 && /[a-zA-Z0-9_]/.test(text[start - 1])) start--;
    while (end < text.length && /[a-zA-Z0-9_]/.test(text[end])) end++;

    return text.slice(start, end);
  }

  findDefinition(text, offset, documentsMap) {
    const word = this.getWordAtPosition(text, offset);
    if (!word) return null;

    const defs = [];
    for (const [uri, doc] of documentsMap) {
      const lines = doc.text.split('\n');
      for (let lineNum = 0; lineNum < lines.length; lineNum++) {
        const line = lines[lineNum];
        const patterns = [
          new RegExp(`\\b(?:let|const)\\s+${word}\\b`),
          new RegExp(`\\bfn\\s+${word}\\b`),
          new RegExp(`\\bclass\\s+${word}\\b`),
          new RegExp(`\\bstruct\\s+${word}\\b`),
          new RegExp(`\\benum\\s+${word}\\b`)
        ];

        for (const pattern of patterns) {
          const match = line.match(pattern);
          if (match) {
            defs.push({
              uri,
              range: {
                start: { line: lineNum, character: match.index },
                end: { line: lineNum, character: match.index + word.length }
              }
            });
          }
        }
      }
    }

    return defs.length > 0 ? defs[0] : null;
  }

  findReferences(text, offset, documentsMap, context) {
    const word = this.getWordAtPosition(text, offset);
    if (!word) return [];

    const refs = [];
    for (const [uri, doc] of documentsMap) {
      const lines = doc.text.split('\n');
      for (let lineNum = 0; lineNum < lines.length; lineNum++) {
        const line = lines[lineNum];
        const regex = new RegExp(`\\b${word}\\b`, 'g');
        let match;
        while ((match = regex.exec(line)) !== null) {
          refs.push({
            uri,
            range: {
              start: { line: lineNum, character: match.index },
              end: { line: lineNum, character: match.index + word.length }
            }
          });
        }
      }
    }

    return refs;
  }

  findHighlights(text, offset) {
    const word = this.getWordAtPosition(text, offset);
    if (!word) return [];

    const highlights = [];
    const lines = text.split('\n');
    const regex = new RegExp(`\\b${word}\\b`, 'g');

    for (let lineNum = 0; lineNum < lines.length; lineNum++) {
      let match;
      while ((match = regex.exec(lines[lineNum])) !== null) {
        highlights.push({
          range: {
            start: { line: lineNum, character: match.index },
            end: { line: lineNum, character: match.index + word.length }
          }
        });
      }
    }

    return highlights;
  }

  extractSymbols(ast) {
    const symbols = [];

    for (const node of ast.body) {
      if (node.name) {
        let kind;
        switch (node.type) {
          case 'FunctionDeclaration':
            kind = SymbolKind.Function;
            break;
          case 'ClassDeclaration':
            kind = SymbolKind.Class;
            break;
          case 'VariableDeclaration':
            kind = SymbolKind.Variable;
            break;
          case 'ImportDeclaration':
            kind = SymbolKind.Module;
            break;
          default:
            kind = SymbolKind.Variable;
        }

        symbols.push({
          name: node.name,
          kind,
          location: {
            uri: ast.uri,
            range: {
              start: node.start,
              end: { line: node.start.line, character: node.start.character + node.name.length }
            }
          }
        });
      }
    }

    return symbols;
  }

  provideCodeLens(ast, uri) {
    const lenses = [];
    const lines = [];

    for (const node of ast.body) {
      if (node.type === 'FunctionDeclaration') {
        lenses.push({
          range: {
            start: node.start,
            end: { line: node.start.line, character: node.start.character + (node.name || 'fn').length + 3 }
          },
          command: {
            title: `▶️ Run Test`,
            command: 'lily.runTest',
            arguments: [uri, node.name]
          }
        });
        lenses.push({
          range: {
            start: node.start,
            end: { line: node.start.line, character: node.start.character + (node.name || 'fn').length + 3 }
          },
          command: {
            title: `🔍 ${node.name || 'fn'} references`,
            command: 'lily.showReferences',
            arguments: [uri, node.start]
          }
        });
      }
    }

    return lenses;
  }

  provideSemanticTokens(ast, text, range) {
    const tokens = ast.tokens;
    const tokenTypeMap = {
      'keyword': 0,
      'string': 1,
      'number': 2,
      'function': 3,
      'class': 4,
      'module': 5,
      'variable': 6,
      'constant': 13,
      'comment': 12,
      'operator': 18,
    };

    const data = [];
    let prevLine = 0;
    let prevChar = 0;

    for (const token of tokens) {
      const typeIndex = tokenTypeMap[token.type] ?? 6;
      const line = token.start.line;
      const char = token.start.character;
      const length = token.value.length;

      if (range) {
        if (line < range.start.line || line > range.end.line) continue;
      }

      const deltaLine = line - prevLine;
      const deltaChar = deltaLine === 0 ? char - prevChar : char;

      let modifiers = 0;
      if (char === 0) modifiers |= 1;

      data.push(deltaLine, deltaChar, length, typeIndex, modifiers);

      prevLine = line;
      prevChar = char;
    }

    return { data };
  }

  provideFoldingRanges(ast) {
    const ranges = [];
    const lineRanges = new Map();

    for (const node of ast.body) {
      if (node.type === 'FunctionDeclaration' || node.type === 'ClassDeclaration') {
        ranges.push({
          startLine: node.start.line,
          endLine: node.start.line + 10,
          kind: 'region'
        });
      }
    }

    return ranges;
  }

  provideSelectionRanges(ast, positions) {
    return positions.map(pos => ({
      range: {
        start: { line: pos.line, character: Math.max(0, pos.character - 5) },
        end: { line: pos.line, character: pos.character + 5 }
      }
    }));
  }

  extractDocumentLinks(text) {
    const links = [];
    const urlRegex = /https?:\/\/[^\s"')]+/g;
    let match;

    while ((match = urlRegex.exec(text)) !== null) {
      const lineNum = text.slice(0, match.index).split('\n').length - 1;
      const lineStart = text.lastIndexOf('\n', match.index) + 1;

      links.push({
        range: {
          start: { line: lineNum, character: match.index - lineStart },
          end: { line: lineNum, character: match.index + match[0].length - lineStart }
        },
        target: match[0]
      });
    }

    return links;
  }

  extractColors(text) {
    const colors = [];
    const colorRegex = /#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g;
    let match;

    while ((match = colorRegex.exec(text)) !== null) {
      const hex = match[1];
      const lineNum = text.slice(0, match.index).split('\n').length - 1;
      const lineStart = text.lastIndexOf('\n', match.index) + 1;

      colors.push({
        range: {
          start: { line: lineNum, character: match.index - lineStart },
          end: { line: lineNum, character: match.index + match[0].length - lineStart }
        },
        color: {
          red: parseInt(hex.slice(0, 2), 16),
          green: parseInt(hex.slice(2, 4), 16),
          blue: parseInt(hex.slice(4, 6), 16),
          alpha: 1
        }
      });
    }

    return colors;
  }
}

module.exports = { LilyAnalyzer };
