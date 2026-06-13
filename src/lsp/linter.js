const fs = require('fs');
const path = require('path');
const { LilyParser } = require('./parser');
const { LilyTypeChecker } = require('./type_checker');
const { LilyAnalyzer } = require('./analyzer');

class LilyLinter {
  constructor() {
    this.parser = new LilyParser();
    this.typeChecker = new LilyTypeChecker();
    this.analyzer = new LilyAnalyzer();
  }

  lint(file) {
    const fullPath = path.resolve(file);
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ File not found: ${file}`);
      return;
    }

    const code = fs.readFileSync(fullPath, 'utf-8');
    const ast = this.parser.parse(code, fullPath);
    const diagnostics = [];

    const doc = {
      uri: `file://${fullPath}`,
      getText: () => code
    };

    diagnostics.push(...this.analyzer.checkSyntax(ast, doc));
    diagnostics.push(...this.analyzer.semanticAnalysis(ast, doc));
    diagnostics.push(...this.analyzer.checkImports(ast, doc));
    diagnostics.push(...this.typeChecker.check(ast, doc));

    console.log(`🔍 Linting: ${path.basename(file)}`);

    const errors = diagnostics.filter(d => d.severity === 1);
    const warnings = diagnostics.filter(d => d.severity === 2 || d.severity === 3);

    if (errors.length > 0) {
      console.log(`\n❌ ${errors.length} Error(s):`);
      errors.forEach(e => {
        const line = e.range.start.line + 1;
        console.log(`   Line ${line}: ${e.message}`);
      });
    }

    if (warnings.length > 0) {
      console.log(`\n⚠️ ${warnings.length} Warning(s):`);
      warnings.forEach(w => {
        const line = w.range.start.line + 1;
        console.log(`   Line ${line}: ${w.message}`);
      });
    }

    if (errors.length === 0 && warnings.length === 0) {
      console.log('   ✅ No issues found! ✨');
    }
  }

  typeCheck(files) {
    if (!files || files.length === 0) {
      console.log('🔎 Type Checking all files in src/...');
      const srcDir = 'src';
      if (fs.existsSync(srcDir)) {
        files = fs.readdirSync(srcDir).filter(f => f.endsWith('.lily'));
      }
    }

    for (const file of files) {
      this.lint(file);
    }
  }
}

module.exports = { LilyLinter };
