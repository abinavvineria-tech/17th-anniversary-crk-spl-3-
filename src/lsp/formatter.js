class LilyFormatter {
  format(text, options = {}) {
    const tabSize = options.tabSize || 4;
    const insertSpaces = options.insertSpaces !== false;
    const indent = insertSpaces ? ' '.repeat(tabSize) : '\t';

    const lines = text.split('\n');
    const result = [];
    let indentLevel = 0;
    let inBlockComment = false;

    for (let line of lines) {
      const stripped = line.trim();

      if (stripped === '' || stripped.startsWith('//')) {
        result.push(inBlockComment ? indent.repeat(indentLevel) + stripped : stripped);
        continue;
      }

      if (stripped.startsWith('(*')) {
        inBlockComment = true;
      }

      if (inBlockComment) {
        if (stripped.endsWith('*)')) {
          inBlockComment = false;
        }
        result.push(indent.repeat(indentLevel) + stripped);
        continue;
      }

      if (stripped.startsWith('}') || stripped.startsWith(')') || stripped.startsWith(']')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }

      let formattedLine = indent.repeat(indentLevel) + stripped;

      const openBraces = (stripped.match(/{/g) || []).length;
      const closeBraces = (stripped.match(/}/g) || []).length;
      const openParens = (stripped.match(/\(/g) || []).length;
      const closeParens = (stripped.match(/\)/g) || []).length;

      if (stripped.endsWith('{') || stripped.endsWith('(')) {
        const endsWithOpenBrace = stripped.endsWith('{');
        if (endsWithOpenBrace) {
          indentLevel++;
        }
      }

      if (openBraces > closeBraces) {
        indentLevel++;
      }
      if (closeBraces > openBraces) {
        indentLevel = Math.max(0, indentLevel - (closeBraces - openBraces));
      }

      formattedLine = this.normalizeSpaces(formattedLine);
      result.push(formattedLine);
    }

    return result.join('\n');
  }

  formatRange(text, range, options = {}) {
    const lines = text.split('\n');
    const startLine = range.start.line;
    const endLine = Math.min(range.end.line, lines.length - 1);
    const selectedLines = lines.slice(startLine, endLine + 1);
    const formatted = this.format(selectedLines.join('\n'), options);
    return formatted.split('\n');
  }

  normalizeSpaces(line) {
    return line
      .replace(/\s+/g, ' ')
      .replace(/\s*=\s*/g, ' = ')
      .replace(/\s*==\s*/g, ' == ')
      .replace(/\s*!=\s*/g, ' != ')
      .replace(/\s*<=\s*/g, ' <= ')
      .replace(/\s*>=\s*/g, ' >= ')
      .replace(/\s*\+\s*/g, ' + ')
      .replace(/\s*-\s*/g, ' - ')
      .replace(/\s*\*\s*/g, ' * ')
      .replace(/\s*\/\s*/g, ' / ')
      .replace(/\s*,\s*/g, ', ')
      .replace(/\s*:\s*/g, ': ')
      .replace(/\(\s*/g, '(')
      .replace(/\s*\)/g, ')')
      .replace(/\s*\{/g, ' {')
      .replace(/\s*;/g, ';')
      .trim();
  }
}

module.exports = { LilyFormatter };
