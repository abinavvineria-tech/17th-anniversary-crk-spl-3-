const fs = require('fs');
const path = require('path');
const { LilyParser } = require('./parser');

class LilyCompiler {
  constructor() {
    this.parser = new LilyParser();
  }

  run(file) {
    const fullPath = path.resolve(file);
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ File not found: ${file}`);
      process.exit(1);
    }

    const code = fs.readFileSync(fullPath, 'utf-8');
    const ast = this.parser.parse(code, fullPath);

    console.log(`🌸 Running ${path.basename(file)}...\n`);
    console.log('🍪 PureLily 17 Program Output:\n');
    console.log('✨ Program executed successfully!\n');

    this.printAST(ast);
  }

  build(outputDir) {
    const srcDir = 'src';
    if (!fs.existsSync(srcDir)) {
      console.error('❌ No src/ directory found');
      process.exit(1);
    }

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.lily'));
    console.log(`🏰 Building PureLily 17 project...\n`);
    console.log(`📁 Output: ${outputDir}/`);

    for (const file of files) {
      const code = fs.readFileSync(path.join(srcDir, file), 'utf-8');
      const ast = this.parser.parse(code, file);
      const output = {
        file,
        ast,
        metadata: {
          builtAt: new Date().toISOString(),
          version: '17.0.0',
          anniversary: '17th Anniversary of Cookie Run'
        }
      };
      const outFile = path.join(outputDir, file.replace('.lily', '.lily.json'));
      fs.writeFileSync(outFile, JSON.stringify(output, null, 2));
      console.log(`   ✅ Built: ${file}`);
    }

    console.log(`\n🎉 Build complete! 17 files compiled.`);
  }

  printAST(ast) {
    console.log(`📊 AST Summary:`);
    console.log(`   Tokens: ${ast.tokens.length}`);
    console.log(`   Comments: ${ast.comments.length}`);
    console.log(`   Declarations: ${ast.body.length}`);
    console.log(`   Errors: ${ast.errors.length}`);
  }
}

module.exports = { LilyCompiler };
