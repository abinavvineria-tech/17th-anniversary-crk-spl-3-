#!/usr/bin/env node

const { program } = require('commander');
const { LilyLanguageServer } = require('../lsp/server');
const { KingdomPackageManager } = require('../package_manager/index');
const { LilyCompiler } = require('../lsp/compiler');
const { LilyFormatter } = require('../lsp/formatter');
const { LilyLinter } = require('../lsp/linter');
const { TemplateManager } = require('../templates/index');
const { Debugger } = require('../debugger/index');
const { CookieEncyclopedia } = require('../lsp/knowledge');

const pkg = require('../../package.json');

program
  .name('lily')
  .description('🌸 PureLily 17 - The official programming language of the Cookie Kingdom')
  .version(pkg.version);

program
  .command('lsp')
  .description('Start the PureLily Language Server')
  .argument('[start]', 'Start the LSP server')
  .action(async (cmd) => {
    const server = new LilyLanguageServer();
    await server.start();
  });

program
  .command('new')
  .description('Create a new PureLily project')
  .argument('<name>', 'Project name')
  .option('-t, --template <template>', 'Project template (default, web, library, game)')
  .action((name, opts) => {
    const tm = new TemplateManager();
    tm.create(name, opts.template || 'default');
  });

program
  .command('run')
  .description('Run a PureLily program')
  .argument('<file>', 'Source file to run')
  .action((file) => {
    const compiler = new LilyCompiler();
    compiler.run(file);
  });

program
  .command('build')
  .description('Build a PureLily project')
  .option('-o, --output <dir>', 'Output directory')
  .action((opts) => {
    const compiler = new LilyCompiler();
    compiler.build(opts.output || 'dist');
  });

program
  .command('format')
  .description('Format PureLily source files')
  .argument('[files...]', 'Files to format')
  .action((files) => {
    const formatter = new LilyFormatter();
    files.forEach(f => {
      const fs = require('fs');
      const path = require('path');
      const fullPath = path.resolve(f);
      if (fs.existsSync(fullPath)) {
        const code = fs.readFileSync(fullPath, 'utf-8');
        const formatted = formatter.format(code);
        fs.writeFileSync(fullPath, formatted);
        console.log(`🎨 Formatted: ${f}`);
      }
    });
  });

program
  .command('lint')
  .description('Lint PureLily source files')
  .argument('[files...]', 'Files to lint')
  .action((files) => {
    const linter = new LilyLinter();
    files.forEach(f => linter.lint(f));
  });

program
  .command('check')
  .description('Type check PureLily source files')
  .argument('[files...]', 'Files to check')
  .action((files) => {
    const linter = new LilyLinter();
    linter.typeCheck(files);
  });

const pm = program.command('pm').description('Kingdom Package Manager');
pm.command('init')
  .description('Initialize a new package')
  .action(() => {
    const kpm = new KingdomPackageManager();
    kpm.init();
  });
pm.command('install')
  .description('Install packages')
  .argument('[packages...]', 'Packages to install')
  .action((packages) => {
    const kpm = new KingdomPackageManager();
    kpm.install(packages);
  });
pm.command('publish')
  .description('Publish a package to the Cookie Registry')
  .action(() => {
    const kpm = new KingdomPackageManager();
    kpm.publish();
  });
pm.command('search')
  .description('Search the Cookie Registry')
  .argument('<query>', 'Search query')
  .action((query) => {
    const kpm = new KingdomPackageManager();
    kpm.search(query);
  });

program
  .command('debug')
  .description('Start the PureLily Debugger')
  .argument('<file>', 'Source file to debug')
  .action((file) => {
    const debugger_ = new Debugger();
    debugger_.start(file);
  });

program
  .command('test')
  .description('Run PureLily tests')
  .argument('[files...]', 'Test files')
  .option('--watch', 'Watch mode')
  .action((files, opts) => {
    const tm = new TemplateManager();
    tm.runTests(files, opts.watch);
  });

program
  .command('docs')
  .description('Open PureLily documentation')
  .action(() => {
    console.log('📖 Opening PureLily Documentation...');
    console.log('   Visit: https://purelily.dev');
  });

program
  .command('encyclopedia')
  .description('Open the Cookie Encyclopedia')
  .action(() => {
    const enc = new CookieEncyclopedia();
    enc.browse();
  });

program
  .command('timeline')
  .description('Start the Timekeeper Timeline Profiler')
  .action(() => {
    console.log('⏳ Timekeeper Timeline Profiler Started');
    console.log('   Analyzing project performance...');
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
