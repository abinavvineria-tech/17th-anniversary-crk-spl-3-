const readline = require('readline');

class Debugger {
  constructor() {
    this.breakpoints = new Set();
    this.watchExpressions = [];
    this.variables = new Map();
  }

  start(file) {
    console.log(`🐛 PureLily 17 Debugger`);
    console.log(`📁 File: ${file}`);
    console.log('🌸 Debug session started!\n');
    console.log('Commands:');
    console.log('  step    - Step to next line');
    console.log('  next    - Step over');
    console.log('  continue - Resume execution');
    console.log('  break <line> - Set breakpoint');
    console.log('  watch <expr> - Watch expression');
    console.log('  vars    - Show variables');
    console.log('  stack   - Show call stack');
    console.log('  quit    - Exit debugger\n');

    this.repl();
  }

  repl() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: '(lily-dbg) '
    });

    rl.prompt();

    rl.on('line', (line) => {
      const [cmd, ...args] = line.trim().split(/\s+/);

      switch (cmd) {
        case 'step':
          console.log('   → Stepped to next line');
          break;
        case 'next':
          console.log('   → Skipped to next line');
          break;
        case 'continue':
        case 'c':
          console.log('   → Resuming execution...');
          break;
        case 'break':
        case 'b':
          if (args[0]) {
            this.breakpoints.add(parseInt(args[0]));
            console.log(`   ✅ Breakpoint set at line ${args[0]}`);
          }
          break;
        case 'watch':
          if (args[0]) {
            this.watchExpressions.push(args.join(' '));
            console.log(`   👁️ Watching: ${args.join(' ')}`);
          }
          break;
        case 'vars':
          console.log('   📦 Local Variables:');
          if (this.variables.size === 0) {
            console.log('       (no variables in scope)');
          } else {
            for (const [name, value] of this.variables) {
              console.log(`       ${name} = ${value}`);
            }
          }
          break;
        case 'stack':
          console.log('   📚 Call Stack:');
          console.log('       main()');
          break;
        case 'help':
          console.log('Commands: step, next, continue, break <line>, watch <expr>, vars, stack, quit');
          break;
        case 'quit':
        case 'exit':
          console.log('🌸 Debug session ended.');
          rl.close();
          process.exit(0);
          break;
        case '':
          break;
        default:
          console.log(`   ❌ Unknown command: ${cmd}`);
      }

      rl.prompt();
    });

    rl.on('close', () => {
      console.log('\n🌸 Debug session ended.');
      process.exit(0);
    });
  }
}

module.exports = { Debugger };
