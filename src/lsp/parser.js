class LilyParser {
  constructor() {
    this.keywords = new Set([
      'bloom', 'ancient', 'wish', 'friend', 'heal',
      'iflight', 'moonpath', 'repeat', 'timeflow',
      'await', 'anniversary', 'kingdom', 'cookie',
      'dragon', 'legendary', 'beast', 'pure',
      'let', 'const', 'fn', 'class', 'import', 'from',
      'export', 'return', 'if', 'else', 'for', 'while',
      'true', 'false', 'none', 'match', 'when',
      'struct', 'trait', 'impl', 'enum', 'mod',
      'pub', 'self', 'super', 'as', 'is', 'not',
      'and', 'or', 'type', 'ref', 'mut', 'static',
      'async', 'flow', 'sparkle', 'glow', 'shine'
    ]);
  }

  parse(text, uri) {
    const lines = text.split('\n');
    const ast = {
      type: 'Program',
      uri,
      body: [],
      comments: [],
      tokens: [],
      errors: []
    };

    let inBlockComment = false;
    let blockCommentStart = 0;

    for (let lineNum = 0; lineNum < lines.length; lineNum++) {
      const line = lines[lineNum];
      let i = 0;

      while (i < line.length) {
        if (inBlockComment) {
          const endIdx = line.indexOf('*)', i);
          if (endIdx !== -1) {
            ast.comments.push({
              type: 'BlockComment',
              value: line.slice(i, endIdx),
              start: { line: lineNum, character: i },
              end: { line: lineNum, character: endIdx + 2 }
            });
            i = endIdx + 2;
            inBlockComment = false;
          } else {
            ast.comments.push({
              type: 'BlockComment',
              value: line.slice(i),
              start: { line: lineNum, character: i },
              end: { line: lineNum, character: line.length }
            });
            break;
          }
        }

        const remaining = line.slice(i);

        const singleLineComment = remaining.match(/^\/\/.*/);
        if (singleLineComment) {
          ast.comments.push({
            type: 'LineComment',
            value: singleLineComment[0].slice(2).trim(),
            start: { line: lineNum, character: i },
            end: { line: lineNum, character: line.length }
          });
          break;
        }

        const blockCommentStartMatch = remaining.match(/^\(\*/);
        if (blockCommentStartMatch) {
          const endIdx = line.indexOf('*)', i + 2);
          if (endIdx !== -1) {
            ast.comments.push({
              type: 'BlockComment',
              value: line.slice(i + 2, endIdx),
              start: { line: lineNum, character: i },
              end: { line: lineNum, character: endIdx + 2 }
            });
            i = endIdx + 2;
          } else {
            inBlockComment = true;
            blockCommentStart = i + 2;
            break;
          }
          continue;
        }

        const stringMatch = remaining.match(/^"([^"\\]*(\\.[^"\\]*)*)"/);
        if (stringMatch) {
          ast.tokens.push({
            type: 'string',
            value: stringMatch[0],
            start: { line: lineNum, character: i },
            end: { line: lineNum, character: i + stringMatch[0].length }
          });
          i += stringMatch[0].length;
          continue;
        }

        const numberMatch = remaining.match(/^\d+(\.\d+)?/);
        if (numberMatch) {
          ast.tokens.push({
            type: 'number',
            value: numberMatch[0],
            start: { line: lineNum, character: i },
            end: { line: lineNum, character: i + numberMatch[0].length }
          });
          i += numberMatch[0].length;
          continue;
        }

        const wordMatch = remaining.match(/^[a-zA-Z_][a-zA-Z0-9_]*/);
        if (wordMatch) {
          const word = wordMatch[0];
          let tokenType = 'identifier';

          if (this.keywords.has(word)) {
            tokenType = 'keyword';
          } else if (word === word.toUpperCase() && word.length > 1) {
            tokenType = 'constant';
          }

          ast.tokens.push({
            type: tokenType,
            value: word,
            start: { line: lineNum, character: i },
            end: { line: lineNum, character: i + word.length }
          });
          i += word.length;
          continue;
        }

        const operatorMatch = remaining.match(/^[+\-*/%=<>!&|^~]+/);
        if (operatorMatch) {
          ast.tokens.push({
            type: 'operator',
            value: operatorMatch[0],
            start: { line: lineNum, character: i },
            end: { line: lineNum, character: i + operatorMatch[0].length }
          });
          i += operatorMatch[0].length;
          continue;
        }

        if (remaining[0] === '(' || remaining[0] === ')' ||
            remaining[0] === '{' || remaining[0] === '}' ||
            remaining[0] === '[' || remaining[0] === ']') {
          ast.tokens.push({
            type: 'delimiter',
            value: remaining[0],
            start: { line: lineNum, character: i },
            end: { line: lineNum, character: i + 1 }
          });
          i++;
          continue;
        }

        if (remaining[0] === ',' || remaining[0] === ';' ||
            remaining[0] === ':' || remaining[0] === '.' ||
            remaining[0] === '@' || remaining[0] === '#') {
          ast.tokens.push({
            type: 'punctuation',
            value: remaining[0],
            start: { line: lineNum, character: i },
            end: { line: lineNum, character: i + 1 }
          });
          i++;
          continue;
        }

        i++;
      }
    }

    ast.body = this.buildAST(ast.tokens);
    return ast;
  }

  buildAST(tokens) {
    const nodes = [];
    let i = 0;

    while (i < tokens.length) {
      const token = tokens[i];

      if (token.type === 'keyword') {
        switch (token.value) {
          case 'import': {
            const node = { type: 'ImportDeclaration', start: token.start };
            i++;
            if (i < tokens.length && tokens[i].value === 'from') i++;
            if (i < tokens.length) {
              node.source = tokens[i].value;
              if (tokens[i].type === 'string') i++;
            }
            nodes.push(node);
            continue;
          }
          case 'fn': {
            const node = { type: 'FunctionDeclaration', start: token.start };
            i++;
            if (i < tokens.length && tokens[i].type === 'identifier') {
              node.name = tokens[i].value;
              i++;
            }
            nodes.push(node);
            continue;
          }
          case 'class': {
            const node = { type: 'ClassDeclaration', start: token.start };
            i++;
            if (i < tokens.length && tokens[i].type === 'identifier') {
              node.name = tokens[i].value;
              i++;
            }
            nodes.push(node);
            continue;
          }
          case 'let':
          case 'const': {
            const node = { type: 'VariableDeclaration', kind: token.value, start: token.start };
            i++;
            if (i < tokens.length && tokens[i].type === 'identifier') {
              node.name = tokens[i].value;
              i++;
            }
            nodes.push(node);
            continue;
          }
        }
      }

      if (token.type === 'identifier') {
        if (i + 1 < tokens.length && tokens[i + 1].value === '(') {
          nodes.push({
            type: 'CallExpression',
            name: token.value,
            start: token.start
          });
        }
      }

      i++;
    }

    return nodes;
  }
}

module.exports = { LilyParser };
