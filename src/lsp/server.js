const {
  createConnection,
  TextDocuments,
  ProposedFeatures,
  InitializeResult,
  TextDocumentSyncKind,
  CompletionItemKind,
  SymbolKind,
  DiagnosticSeverity,
  CodeActionKind,
  TextDocumentPositionParams,
  SemanticTokensRequest,
  SemanticTokensRangeRequest,
  InlayHintRequest,
  InlayHintLabelPart
} = require('vscode-languageserver/node');
const { TextDocument } = require('vscode-languageserver-textdocument');
const { LilyParser } = require('./parser');
const { LilyTypeChecker } = require('./type_checker');
const { LilyAnalyzer } = require('./analyzer');
const { LilyCompleter } = require('./completer');
const { LilyHoverProvider } = require('./hover');
const { LilyRefactorer } = require('./refactor');
const { LilyFormatter } = require('./formatter');
const { CookieEncyclopedia } = require('./knowledge');
const path = require('path');

function encodeSemanticTokens(tokens) {
  const data = [];
  let prevLine = 0;
  let prevChar = 0;

  for (const token of tokens) {
    const deltaLine = token.line - prevLine;
    const deltaChar = deltaLine === 0 ? token.startChar - prevChar : token.startChar;

    data.push(deltaLine, deltaChar, token.length, token.typeIdx, token.modifiers);

    prevLine = token.line;
    prevChar = token.startChar;
  }

  return { data };
}

class LilyLanguageServer {
  constructor() {
    this.connection = createConnection(process.stdin, process.stdout);
    this.documents = new TextDocuments(TextDocument);
    this.parser = new LilyParser();
    this.typeChecker = new LilyTypeChecker();
    this.analyzer = new LilyAnalyzer();
    this.completer = new LilyCompleter();
    this.hoverProvider = new LilyHoverProvider();
    this.refactorer = new LilyRefactorer();
    this.formatter = new LilyFormatter();
    this.encyclopedia = new CookieEncyclopedia();
    this.documentsMap = new Map();

    this.initialize();
  }

  initialize() {
    this.connection.onInitialize((params) => {
      return {
        capabilities: {
          textDocumentSync: {
            openClose: true,
            change: TextDocumentSyncKind.Incremental,
            save: { includeText: true }
          },
          completionProvider: {
            triggerCharacters: ['.', ':', '/', '@', '#'],
            resolveProvider: true,
            completionItem: { labelDetailsSupport: true }
          },
          hoverProvider: true,
          signatureHelpProvider: { triggerCharacters: ['(', ',', ')'] },
          definitionProvider: true,
          referencesProvider: true,
          documentHighlightProvider: true,
          documentSymbolProvider: true,
          workspaceSymbolProvider: true,
          codeActionProvider: {
            codeActionKinds: [
              CodeActionKind.QuickFix,
              CodeActionKind.Refactor,
              CodeActionKind.RefactorExtract,
              CodeActionKind.RefactorInline,
              CodeActionKind.RefactorRewrite,
              CodeActionKind.SourceOrganizeImports
            ],
            resolveProvider: true
          },
          codeLensProvider: { resolveProvider: true },
          documentFormattingProvider: true,
          documentRangeFormattingProvider: true,
          documentLinkProvider: { resolveProvider: true },
          colorProvider: true,
          foldingRangeProvider: true,
          selectionRangeProvider: true,
          renameProvider: { prepareProvider: true },
          inlayHintProvider: { resolveProvider: true },
          semanticTokensProvider: {
            full: true,
            range: true,
            legend: {
              tokenTypes: [
                'keyword', 'string', 'number', 'function', 'class',
                'module', 'variable', 'property', 'enum', 'interface',
                'type', 'parameter', 'comment', 'constant', 'macro',
                'decorator', 'method', 'namespace', 'operator', 'regexp',
                'typeParameter', 'label', 'struct', 'event', 'modifier',
                'async', 'warning', 'error', 'success'
              ],
              tokenModifiers: [
                'declaration', 'definition', 'readonly', 'static',
                'deprecated', 'abstract', 'async', 'modification',
                'documentation', 'defaultLibrary', 'golden',
                'crimson', 'oceanBlue', 'dragonFlame', 'temporalPurple',
                'goldenCream', 'natureGreen', 'dualGreenGold',
                'seventeenStarGolden'
              ]
            }
          },
          workspace: {
            workspaceFolders: { supported: true, changeNotifications: true }
          },
          diagnosticProvider: {
            interFileDependencies: true,
            workspaceDiagnostics: true
          },
          experimental: {
            cookieKnowledge: true,
            timelineProfiler: true,
            dependencyGraph: true,
            packageBrowser: true,
            symbolExplorer: true,
            buildDashboard: true,
            testExplorer: true,
            debuggerSupport: true
          }
        }
      };
    });

    this.connection.onInitialized(() => {
      // Engines ready
    });

    this.documents.onDidOpen((event) => {
      this.analyzeDocument(event.document);
    });

    this.documents.onDidChangeContent((event) => {
      this.analyzeDocument(event.document);
    });

    this.documents.onDidSave((event) => {
      this.updateDependencies(event.document);
    });

    this.connection.onCompletion((params) => {
      return this.handleCompletion(params);
    });

    this.connection.onCompletionResolve((item) => {
      return this.handleCompletionResolve(item);
    });

    this.connection.onHover((params) => {
      return this.handleHover(params);
    });

    this.connection.onSignatureHelp((params) => {
      return this.handleSignatureHelp(params);
    });

    this.connection.onDefinition((params) => {
      return this.handleGoToDefinition(params);
    });

    this.connection.onReferences((params) => {
      return this.handleFindReferences(params);
    });

    this.connection.onDocumentHighlight((params) => {
      return this.handleDocumentHighlight(params);
    });

    this.connection.onDocumentSymbol((params) => {
      return this.handleDocumentSymbol(params);
    });

    this.connection.onWorkspaceSymbol((params) => {
      return this.handleWorkspaceSymbol(params);
    });

    this.connection.onCodeAction((params) => {
      return this.handleCodeAction(params);
    });

    this.connection.onCodeActionResolve((params) => {
      return this.handleCodeActionResolve(params);
    });

    this.connection.onCodeLens((params) => {
      return this.handleCodeLens(params);
    });

    this.connection.onDocumentFormatting((params) => {
      return this.handleFormatting(params);
    });

    this.connection.onDocumentRangeFormatting((params) => {
      return this.handleRangeFormatting(params);
    });

    this.connection.onRenameRequest((params) => {
      return this.handleRename(params);
    });

    this.connection.onPrepareRename((params) => {
      return this.handlePrepareRename(params);
    });

    this.connection.onDocumentLinks((params) => {
      return this.handleDocumentLinks(params);
    });

    this.connection.onDocumentColor((params) => {
      return this.handleDocumentColors(params);
    });

    this.connection.onColorPresentation((params) => {
      return this.handleColorPresentation(params);
    });

    this.connection.onFoldingRanges((params) => {
      return this.handleFoldingRanges(params);
    });

    this.connection.onSelectionRanges((params) => {
      return this.handleSelectionRanges(params);
    });

    this.connection.onRequest(SemanticTokensRequest.type, (params) => {
      return this.handleSemanticTokensFull(params);
    });

    this.connection.onRequest(SemanticTokensRangeRequest.type, (params) => {
      return this.handleSemanticTokensRange(params);
    });

    this.connection.onRequest(InlayHintRequest.type, (params) => {
      return this.handleInlayHints(params);
    });

    this.documents.listen(this.connection);
    this.connection.listen();
  }

  analyzeDocument(document) {
    const uri = document.uri;
    const text = document.getText();
    const ast = this.parser.parse(text, uri);
    const diagnostics = [];

    this.documentsMap.set(uri, { ast, text });

    const syntaxDiags = this.analyzer.checkSyntax(ast, document);
    diagnostics.push(...syntaxDiags);

    const typeDiags = this.typeChecker.check(ast, document);
    diagnostics.push(...typeDiags);

    const semanticDiags = this.analyzer.semanticAnalysis(ast, document);
    diagnostics.push(...semanticDiags);

    const importDiags = this.analyzer.checkImports(ast, document);
    diagnostics.push(...importDiags);

    this.connection.sendDiagnostics({ uri, diagnostics });
  }

  updateDependencies(document) {
    const uri = document.uri;
    const text = document.getText();
    const deps = this.analyzer.extractDependencies(text);
    this.analyzer.updateDependencyGraph(uri, deps);
  }

  handleCompletion(params) {
    const document = this.documents.get(params.textDocument.uri);
    if (!document) return null;

    const text = document.getText();
    const offset = document.offsetAt(params.position);
    const context = this.analyzer.getCompletionContext(text, offset);

    return this.completer.provideCompletions(text, offset, context, document);
  }

  handleCompletionResolve(item) {
    return this.completer.resolveCompletion(item);
  }

  handleHover(params) {
    const document = this.documents.get(params.textDocument.uri);
    if (!document) return null;

    const text = document.getText();
    const offset = document.offsetAt(params.position);
    const word = this.analyzer.getWordAtPosition(text, offset);

    const cookieDoc = this.encyclopedia.lookup(word);
    if (cookieDoc) {
      return { contents: { kind: 'markdown', value: cookieDoc } };
    }

    const hoverContent = this.hoverProvider.provideHover(
      text, offset, word, this.documentsMap.get(params.textDocument.uri)?.ast
    );

    if (hoverContent) {
      return { contents: { kind: 'markdown', value: hoverContent } };
    }

    const signatureDoc = this.typeChecker.getDocumentation(word);
    if (signatureDoc) {
      return { contents: { kind: 'markdown', value: signatureDoc } };
    }

    return null;
  }

  handleSignatureHelp(params) {
    const document = this.documents.get(params.textDocument.uri);
    if (!document) return null;

    const text = document.getText();
    const offset = document.offsetAt(params.position);

    return this.completer.provideSignatureHelp(text, offset);
  }

  handleGoToDefinition(params) {
    const document = this.documents.get(params.textDocument.uri);
    if (!document) return null;

    const text = document.getText();
    const offset = document.offsetAt(params.position);

    return this.analyzer.findDefinition(text, offset, this.documentsMap);
  }

  handleFindReferences(params) {
    const document = this.documents.get(params.textDocument.uri);
    if (!document) return null;

    const text = document.getText();
    const offset = document.offsetAt(params.position);

    return this.analyzer.findReferences(text, offset, this.documentsMap, params.context);
  }

  handleDocumentHighlight(params) {
    const document = this.documents.get(params.textDocument.uri);
    if (!document) return null;

    const text = document.getText();
    const offset = document.offsetAt(params.position);

    return this.analyzer.findHighlights(text, offset);
  }

  handleDocumentSymbol(params) {
    const document = this.documents.get(params.textDocument.uri);
    if (!document) return null;

    const text = document.getText();
    const ast = this.parser.parse(text, params.textDocument.uri);

    return this.analyzer.extractSymbols(ast);
  }

  handleWorkspaceSymbol(params) {
    const query = params.query.toLowerCase();
    const results = [];

    for (const [uri, doc] of this.documentsMap) {
      const symbols = this.analyzer.extractSymbols(this.parser.parse(doc.text, uri));
      symbols.forEach(sym => {
        if (sym.name.toLowerCase().includes(query)) {
          results.push({ ...sym, location: { uri, range: sym.location.range } });
        }
      });
    }

    return results;
  }

  handleCodeAction(params) {
    const document = this.documents.get(params.textDocument.uri);
    if (!document) return null;

    const text = document.getText();
    const ast = this.parser.parse(text, params.textDocument.uri);

    return this.refactorer.provideCodeActions(params, ast, this.documentsMap);
  }

  handleCodeActionResolve(params) {
    return this.refactorer.resolveCodeAction(params);
  }

  handleCodeLens(params) {
    const document = this.documents.get(params.textDocument.uri);
    if (!document) return [];

    const text = document.getText();
    const ast = this.parser.parse(text, params.textDocument.uri);

    return this.analyzer.provideCodeLens(ast, params.textDocument.uri);
  }

  handleFormatting(params) {
    const document = this.documents.get(params.textDocument.uri);
    if (!document) return null;

    const text = document.getText();
    const formatted = this.formatter.format(text, params.options);

    return [{
      range: {
        start: { line: 0, character: 0 },
        end: { line: text.split('\n').length, character: 0 }
      },
      newText: formatted
    }];
  }

  handleRangeFormatting(params) {
    const document = this.documents.get(params.textDocument.uri);
    if (!document) return null;

    const text = document.getText();
    const formatted = this.formatter.formatRange(text, params.range, params.options);

    return [{
      range: params.range,
      newText: formatted
    }];
  }

  handleRename(params) {
    const document = this.documents.get(params.textDocument.uri);
    if (!document) return null;

    const text = document.getText();
    const offset = document.offsetAt(params.position);

    return this.refactorer.prepareRename(text, offset, params.newName, this.documentsMap);
  }

  handlePrepareRename(params) {
    const document = this.documents.get(params.textDocument.uri);
    if (!document) return null;

    const text = document.getText();
    const offset = document.offsetAt(params.position);

    return this.refactorer.canRename(text, offset);
  }

  handleInlayHints(params) {
    const document = this.documents.get(params.textDocument.uri);
    if (!document) return [];

    const text = document.getText();
    const ast = this.parser.parse(text, params.textDocument.uri);

    return this.typeChecker.provideInlayHints(ast, params.range);
  }

  handleSemanticTokensFull(params) {
    const document = this.documents.get(params.textDocument.uri);
    if (!document) return { data: [] };

    const text = document.getText();
    const ast = this.parser.parse(text, params.textDocument.uri);

    return this.analyzer.provideSemanticTokens(ast, text);
  }

  handleSemanticTokensRange(params) {
    const document = this.documents.get(params.textDocument.uri);
    if (!document) return { data: [] };

    const text = document.getText();
    const ast = this.parser.parse(text, params.textDocument.uri);

    return this.analyzer.provideSemanticTokens(ast, text, params.range);
  }

  handleFoldingRanges(params) {
    const document = this.documents.get(params.textDocument.uri);
    if (!document) return [];

    const text = document.getText();
    const ast = this.parser.parse(text, params.textDocument.uri);

    return this.analyzer.provideFoldingRanges(ast);
  }

  handleSelectionRanges(params) {
    const document = this.documents.get(params.textDocument.uri);
    if (!document) return [];

    const text = document.getText();
    const ast = this.parser.parse(text, params.textDocument.uri);

    return this.analyzer.provideSelectionRanges(ast, params.positions);
  }

  handleDocumentLinks(params) {
    const document = this.documents.get(params.textDocument.uri);
    if (!document) return [];

    const text = document.getText();
    return this.analyzer.extractDocumentLinks(text);
  }

  handleDocumentColors(params) {
    const document = this.documents.get(params.textDocument.uri);
    if (!document) return [];

    const text = document.getText();
    return this.analyzer.extractColors(text);
  }

  handleColorPresentation(params) {
    return [{
      label: params.color.red + ', ' + params.color.green + ', ' + params.color.blue,
      textEdit: {
        range: params.range,
        newText: `rgb(${params.color.red}, ${params.color.green}, ${params.color.blue})`
      }
    }];
  }

  async start() {
    this.connection.onShutdown(() => {
      console.log('🌸 PureLily Language Server Stopped');
      console.log('✨ Thank you for using PureLily 17!');
      process.exit(0);
    });

    console.log('🌸 PureLily Language Server Started');
    console.log('🍦 Pure Vanilla Analysis Engine Enabled');
    console.log('🌿 White Lily Knowledge Engine Enabled');
    console.log('⏳ Timekeeper Timeline Index Ready');
    console.log('✨ Cookie Kingdom Development Environment Ready');
  }
}

module.exports = { LilyLanguageServer };

if (require.main === module) {
  const server = new LilyLanguageServer();
}
