class LilyTypeChecker {
  constructor() {
    this.types = new Map();
    this.builtins = new Map([
      ['int', { kind: 'primitive', name: 'int' }],
      ['float', { kind: 'primitive', name: 'float' }],
      ['string', { kind: 'primitive', name: 'string' }],
      ['bool', { kind: 'primitive', name: 'bool' }],
      ['none', { kind: 'primitive', name: 'none' }],
      ['Cookie', { kind: 'class', name: 'Cookie' }],
      ['Kingdom', { kind: 'class', name: 'Kingdom' }],
      ['Dragon', { kind: 'class', name: 'Dragon' }],
      ['Recipe', { kind: 'class', name: 'Recipe' }],
      ['Friendship', { kind: 'class', name: 'Friendship' }],
    ]);
  }

  check(ast, document) {
    const diagnostics = [];

    for (const node of ast.body) {
      switch (node.type) {
        case 'VariableDeclaration': {
          if (node.kind === 'const' && !node.value) {
            diagnostics.push({
              severity: 1,
              range: {
                start: node.start,
                end: { line: node.start.line, character: node.start.character + 5 }
              },
              message: `Const '${node.name}' must be initialized`,
              source: 'lily-type-checker'
            });
          }
          break;
        }
        case 'CallExpression': {
          this.checkCallExpression(node, diagnostics, document);
          break;
        }
      }
    }

    return diagnostics;
  }

  checkCallExpression(node, diagnostics, document) {
    if (node.name === 'bloom' || node.name === 'wish') {
      diagnostics.push({
        severity: 1,
        range: {
          start: node.start,
          end: { line: node.start.line, character: node.start.character + node.name.length }
        },
        message: `${node.name}() must be called within an async 'timeflow' function`,
        source: 'lily-type-checker'
      });
    }
  }

  provideInlayHints(ast, range) {
    const hints = [];

    for (const node of ast.body) {
      if (node.type === 'VariableDeclaration' && !node.typeAnnotation) {
        const inferredType = this.inferType(node);
        hints.push({
          position: node.end || node.start,
          label: `: ${inferredType}`,
          kind: 2,
          paddingLeft: true
        });
      }
    }

    return hints;
  }

  inferType(node) {
    if (node.value === undefined || node.value === null) return 'none';
    if (typeof node.value === 'string') return 'string';
    if (typeof node.value === 'number') {
      return Number.isInteger(node.value) ? 'int' : 'float';
    }
    if (typeof node.value === 'boolean') return 'bool';
    return 'unknown';
  }

  getDocumentation(name) {
    const typeDoc = this.builtins.get(name);
    if (typeDoc) {
      return `**${typeDoc.kind}** \`${typeDoc.name}\`\n\n*Cookie Kingdom Core Type*`;
    }
    return null;
  }
}

module.exports = { LilyTypeChecker };
