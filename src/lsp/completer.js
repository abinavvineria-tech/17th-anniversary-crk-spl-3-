const { CompletionItemKind, InsertTextFormat, InlineCompletionTriggerKind } = require('vscode-languageserver/node');

class LilyCompleter {
  constructor() {
    this.cache = new Map();
  }

  provideCompletions(text, offset, context, document) {
    const items = [];
    const prefix = context.prefix || '';

    const keywords = [
      { label: 'bloom', kind: CompletionItemKind.Keyword, detail: 'Awaken the bloom within' },
      { label: 'ancient', kind: CompletionItemKind.Keyword, detail: 'Ancient Cookie power' },
      { label: 'wish', kind: CompletionItemKind.Keyword, detail: 'Make a wish upon a star' },
      { label: 'friend', kind: CompletionItemKind.Keyword, detail: 'Friendship is magic' },
      { label: 'heal', kind: CompletionItemKind.Keyword, detail: 'Heal and restore' },
      { label: 'iflight', kind: CompletionItemKind.Keyword, detail: 'Illuminate the path' },
      { label: 'moonpath', kind: CompletionItemKind.Keyword, detail: 'Walk the moonpath' },
      { label: 'repeat', kind: CompletionItemKind.Keyword, detail: 'Repeat the cycle' },
      { label: 'timeflow', kind: CompletionItemKind.Keyword, detail: 'Flow through time' },
      { label: 'await', kind: CompletionItemKind.Keyword, detail: 'Await a timeflow operation' },
      { label: 'let', kind: CompletionItemKind.Keyword, detail: 'Declare a mutable variable' },
      { label: 'const', kind: CompletionItemKind.Keyword, detail: 'Declare a constant' },
      { label: 'fn', kind: CompletionItemKind.Keyword, detail: 'Define a function' },
      { label: 'class', kind: CompletionItemKind.Keyword, detail: 'Define a class' },
      { label: 'import', kind: CompletionItemKind.Keyword, detail: 'Import a module' },
      { label: 'export', kind: CompletionItemKind.Keyword, detail: 'Export a symbol' },
      { label: 'return', kind: CompletionItemKind.Keyword, detail: 'Return from a function' },
      { label: 'if', kind: CompletionItemKind.Keyword, detail: 'Conditional branch' },
      { label: 'else', kind: CompletionItemKind.Keyword, detail: 'Alternative branch' },
      { label: 'for', kind: CompletionItemKind.Keyword, detail: 'Iterate over items' },
      { label: 'while', kind: CompletionItemKind.Keyword, detail: 'Loop while condition' },
      { label: 'match', kind: CompletionItemKind.Keyword, detail: 'Pattern matching' },
      { label: 'struct', kind: CompletionItemKind.Keyword, detail: 'Define a struct' },
      { label: 'trait', kind: CompletionItemKind.Keyword, detail: 'Define a trait' },
      { label: 'impl', kind: CompletionItemKind.Keyword, detail: 'Implement a trait' },
      { label: 'enum', kind: CompletionItemKind.Keyword, detail: 'Define an enum' },
      { label: 'pub', kind: CompletionItemKind.Keyword, detail: 'Public visibility' },
      { label: 'async', kind: CompletionItemKind.Keyword, detail: 'Async function' },
      { label: 'true', kind: CompletionItemKind.Keyword, detail: 'Boolean true' },
      { label: 'false', kind: CompletionItemKind.Keyword, detail: 'Boolean false' },
      { label: 'none', kind: CompletionItemKind.Keyword, detail: 'Null value' },
    ];

    const snippets = [
      {
        label: 'fn',
        kind: CompletionItemKind.Snippet,
        insertText: 'fn ${1:name}(${2:params}) {\n\t${3}\n}',
        insertTextFormat: InsertTextFormat.Snippet,
        detail: 'Function snippet'
      },
      {
        label: 'class',
        kind: CompletionItemKind.Snippet,
        insertText: 'class ${1:Name} {\n\t${2}\n}',
        insertTextFormat: InsertTextFormat.Snippet,
        detail: 'Class snippet'
      },
      {
        label: 'import',
        kind: CompletionItemKind.Snippet,
        insertText: 'import ${1:module} from "${2:path}"',
        insertTextFormat: InsertTextFormat.Snippet,
        detail: 'Import snippet'
      },
      {
        label: 'for',
        kind: CompletionItemKind.Snippet,
        insertText: 'for ${1:item} in ${2:items} {\n\t${3}\n}',
        insertTextFormat: InsertTextFormat.Snippet,
        detail: 'For loop snippet'
      },
      {
        label: 'match',
        kind: CompletionItemKind.Snippet,
        insertText: 'match ${1:value} {\n\t${2:pattern} => ${3}\n}',
        insertTextFormat: InsertTextFormat.Snippet,
        detail: 'Match expression snippet'
      },
      {
        label: 'friend',
        kind: CompletionItemKind.Snippet,
        insertText: 'friend ${1:name} {\n\t${2}\n}',
        insertTextFormat: InsertTextFormat.Snippet,
        detail: 'Friendship block snippet'
      },
    ];

    const builtinTypes = [
      { label: 'Cookie', kind: CompletionItemKind.Class, detail: 'Base Cookie class' },
      { label: 'Kingdom', kind: CompletionItemKind.Class, detail: 'Cookie Kingdom realm' },
      { label: 'Dragon', kind: CompletionItemKind.Class, detail: 'Dragon class' },
      { label: 'Friendship', kind: CompletionItemKind.Class, detail: 'Friendship bond' },
      { label: 'Recipe', kind: CompletionItemKind.Class, detail: 'Cookie recipe' },
      { label: 'int', kind: CompletionItemKind.TypeParameter, detail: 'Integer type' },
      { label: 'float', kind: CompletionItemKind.TypeParameter, detail: 'Float type' },
      { label: 'string', kind: CompletionItemKind.TypeParameter, detail: 'String type' },
      { label: 'bool', kind: CompletionItemKind.TypeParameter, detail: 'Boolean type' },
    ];

    const sugarFunctions = [
      { label: 'bloom()', kind: CompletionItemKind.Function, detail: 'Awaken power' },
      { label: 'wish()', kind: CompletionItemKind.Function, detail: 'Make a wish' },
      { label: 'heal()', kind: CompletionItemKind.Function, detail: 'Restore health' },
      { label: 'glow()', kind: CompletionItemKind.Function, detail: 'Emit light' },
      { label: 'sparkle()', kind: CompletionItemKind.Function, detail: 'Create sparkles' },
      { label: 'shine()', kind: CompletionItemKind.Function, detail: 'Shine brightly' },
      { label: 'flow()', kind: CompletionItemKind.Function, detail: 'Flow like time' },
      { label: 'friendship.bloom()', kind: CompletionItemKind.Function, detail: 'Bloom friendship' },
      { label: 'friendship.unity()', kind: CompletionItemKind.Function, detail: 'Unite friends' },
      { label: 'friendship.hope()', kind: CompletionItemKind.Function, detail: 'Spread hope' },
    ];

    if (context.type === 'member') {
      const moduleName = context.module;
      if (moduleName === 'friendship') {
        items.push(
          { label: 'bloom', kind: CompletionItemKind.Method, detail: 'Bloom friendship power', insertText: 'bloom()' },
          { label: 'unity', kind: CompletionItemKind.Method, detail: 'Unite as friends', insertText: 'unity()' },
          { label: 'hope', kind: CompletionItemKind.Method, detail: 'Spread hope and light', insertText: 'hope()' },
        );
      } else if (moduleName === 'kingdom') {
        items.push(
          { label: 'build', kind: CompletionItemKind.Method, detail: 'Build kingdom structure', insertText: 'build()' },
          { label: 'defend', kind: CompletionItemKind.Method, detail: 'Defend the kingdom', insertText: 'defend()' },
          { label: 'celebrate', kind: CompletionItemKind.Method, detail: 'Celebrate anniversary', insertText: 'celebrate()' },
        );
      }
    } else {
      items.push(...keywords.filter(k => k.label.startsWith(prefix)));
      items.push(...snippets.filter(s => s.label.startsWith(prefix)));
      items.push(...builtinTypes.filter(t => t.label.toLowerCase().startsWith(prefix)));
      items.push(...sugarFunctions.filter(f => f.label.startsWith(prefix)));
    }

    const sugarCookies = [
      { label: 'PureVanilla', kind: CompletionItemKind.Class, detail: 'Pure Vanilla Cookie - Light and healing' },
      { label: 'WhiteLily', kind: CompletionItemKind.Class, detail: 'White Lily Cookie - Knowledge and magic' },
      { label: 'Hollyberry', kind: CompletionItemKind.Class, detail: 'Hollyberry Cookie - Strength and courage' },
      { label: 'DarkCacao', kind: CompletionItemKind.Class, detail: 'Dark Cacao Cookie - Wisdom and darkness' },
      { label: 'GoldenCheese', kind: CompletionItemKind.Class, detail: 'Golden Cheese Cookie - Prosperity and wealth' },
      { label: 'SeaFairy', kind: CompletionItemKind.Class, detail: 'Sea Fairy Cookie - Ocean and dreams' },
      { label: 'Moonlight', kind: CompletionItemKind.Class, detail: 'Moonlight Cookie - Dreams and stars' },
      { label: 'Timekeeper', kind: CompletionItemKind.Class, detail: 'Timekeeper Cookie - Time and space' },
    ];

    items.push(...sugarCookies.filter(c => c.label.toLowerCase().includes(prefix.toLowerCase())));

    return {
      isIncomplete: false,
      items
    };
  }

  resolveCompletion(item) {
    if (item.kind === CompletionItemKind.Keyword) {
      item.documentation = {
        kind: 'markdown',
        value: `**${item.label}**\n\n🌸 *PureLily 17 Keyword*\n\nPart of the Cookie Kingdom programming language.`
      };
    }
    return item;
  }

  provideSignatureHelp(text, offset) {
    const before = text.slice(0, offset);
    const parenOpen = before.lastIndexOf('(');
    const lastParenClose = before.lastIndexOf(')');

    if (parenOpen === -1 || parenOpen < lastParenClose) return null;

    const beforeParen = text.slice(0, parenOpen).trim();
    const funcName = beforeParen.split(/[\s\n]/).pop();

    const signatures = {
      'bloom': {
        label: 'bloom(target: Cookie): void',
        documentation: '🌸 Awaken the bloom within a Cookie. Must be called within a timeflow function.',
        parameters: [{ label: 'target: Cookie', documentation: 'The Cookie to awaken' }]
      },
      'wish': {
        label: 'wish(wish: string): Promise<outcome>',
        documentation: '🌟 Make a wish upon a star. Returns the outcome of the wish.',
        parameters: [{ label: 'wish: string', documentation: 'The wish to make' }]
      },
      'heal': {
        label: 'heal(target: Cookie, amount: int): void',
        documentation: '💚 Heal and restore a Cookie\'s health.',
        parameters: [
          { label: 'target: Cookie', documentation: 'The Cookie to heal' },
          { label: 'amount: int', documentation: 'Amount of healing' }
        ]
      },
      'friendship.bloom': {
        label: 'friendship.bloom(): void',
        documentation: '💚 Bloom the power of friendship.',
        parameters: []
      },
      'friendship.unity': {
        label: 'friendship.unity(cookies: Cookie[]): void',
        documentation: '💚 Unite Cookies in friendship.',
        parameters: [{ label: 'cookies: Cookie[]', documentation: 'The Cookies to unite' }]
      },
    };

    const sig = signatures[funcName];
    if (sig) {
      const activeParam = (text.slice(parenOpen + 1, offset).match(/,/g) || []).length;
      return {
        signatures: [{
          label: sig.label,
          documentation: sig.documentation,
          parameters: sig.parameters
        }],
        activeSignature: 0,
        activeParameter: Math.min(activeParam, sig.parameters.length - 1)
      };
    }

    return null;
  }

  provideInlineCompletions(text, offset, context) {
    if (context.triggerKind === InlineCompletionTriggerKind.Automatic) {
      const before = text.slice(0, offset);
      const currentLine = before.split('\n').pop() || '';
      const trimmed = currentLine.trimStart();

      const suggestions = [];

      if (trimmed === 'fn ') {
        suggestions.push({
          text: 'myFunction() {\n\t\n}',
          range: {
            start: { line: text.slice(0, offset).split('\n').length - 1, character: 3 },
            end: { line: text.slice(0, offset).split('\n').length - 1, character: 999 }
          }
        });
      }

      if (trimmed === 'import ') {
        suggestions.push({
          text: 'from "./"',
          range: {
            start: { line: text.slice(0, offset).split('\n').length - 1, character: 7 },
            end: { line: text.slice(0, offset).split('\n').length - 1, character: 999 }
          }
        });
      }

      return { items: suggestions };
    }

    return { items: [] };
  }
}

module.exports = { LilyCompleter };
