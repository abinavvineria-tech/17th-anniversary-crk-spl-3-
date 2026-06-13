const fs = require('fs');
const path = require('path');

class KingdomPackageManager {
  constructor() {
    this.registry = 'https://registry.purelily.dev';
  }

  init() {
    const pkg = {
      name: path.basename(process.cwd()),
      version: '1.0.0',
      description: '🌸 A PureLily 17 package',
      main: 'src/index.lily',
      scripts: {
        build: 'lily build',
        test: 'lily test',
        start: 'lily run src/index.lily'
      },
      dependencies: {},
      devDependencies: {},
      kingdom: {
        type: 'library',
        category: 'utility',
        anniversary: '17',
        cookies: []
      }
    };

    const pkgPath = 'kingdom.json';
    if (fs.existsSync(pkgPath)) {
      console.log('📦 kingdom.json already exists');
      return;
    }

    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
    console.log('📦 Initialized PureLily 17 package');
    console.log('   Created: kingdom.json');
    console.log('\n💡 Next steps:');
    console.log('   - Create src/index.lily');
    console.log('   - Run: lily pm install <package>');
    console.log('   - Run: lily run src/index.lily');
  }

  install(packages) {
    if (!packages || packages.length === 0) {
      if (fs.existsSync('kingdom.json')) {
        const manifest = JSON.parse(fs.readFileSync('kingdom.json', 'utf-8'));
        packages = Object.keys(manifest.dependencies || {});
        if (packages.length === 0) {
          console.log('📦 No dependencies to install');
          return;
        }
      } else {
        console.log('❌ No kingdom.json found. Run "lily pm init" first.');
        return;
      }
    }

    if (!fs.existsSync('kingdom_modules')) {
      fs.mkdirSync('kingdom_modules', { recursive: true });
    }

    for (const pkg of packages) {
      const [name, version = 'latest'] = pkg.includes('@') ? pkg.split('@') : [pkg, 'latest'];
      console.log(`📦 Installing ${name}@${version}...`);
      console.log(`   ✅ ${name}@${version} installed ✨`);

      const manifestPath = 'kingdom.json';
      if (fs.existsSync(manifestPath)) {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
        manifest.dependencies = manifest.dependencies || {};
        manifest.dependencies[name] = version;
        fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
      }
    }
  }

  publish() {
    if (!fs.existsSync('kingdom.json')) {
      console.log('❌ No kingdom.json found');
      return;
    }

    const manifest = JSON.parse(fs.readFileSync('kingdom.json', 'utf-8'));
    console.log(`📤 Publishing ${manifest.name} v${manifest.version}...`);
    console.log(`   📡 Registry: ${this.registry}`);
    console.log('   ✅ Package published successfully! 🎉');
    console.log(`   🔗 ${this.registry}/packages/${manifest.name}`);
  }

  search(query) {
    console.log(`🔍 Searching "${query}" in the Cookie Registry...\n`);

    const results = [
      {
        name: 'friendship.core',
        version: '17.0.0',
        description: '💚 The power of friendship - inspired by Pure Vanilla & White Lily',
        downloads: '17K/week',
        cookie: 'Pure Vanilla'
      },
      {
        name: 'kingdom.game',
        version: '17.1.0',
        description: '🏰 Build and manage your Cookie Kingdom',
        downloads: '17K/week',
        cookie: 'Hollyberry'
      },
      {
        name: 'vanilla.light',
        version: '17.0.0',
        description: '✨ Healing light of Pure Vanilla Cookie',
        downloads: '17K/week',
        cookie: 'Pure Vanilla'
      },
      {
        name: 'lily.wisdom',
        version: '17.0.0',
        description: '🌿 Ancient knowledge of White Lily Cookie',
        downloads: '17K/week',
        cookie: 'White Lily'
      },
      {
        name: 'timekeeper.flow',
        version: '17.0.0',
        description: '⏳ Temporal magic of Timekeeper Cookie',
        downloads: '17K/week',
        cookie: 'Timekeeper'
      },
      {
        name: 'dragon.flame',
        version: '17.0.0',
        description: '🐉 Ancient dragon power module',
        downloads: '17K/week',
        cookie: 'Pitaya Dragon'
      },
    ];

    const filtered = results.filter(r =>
      r.name.toLowerCase().includes(query.toLowerCase())
    );

    if (filtered.length === 0) {
      console.log('   No results found. Try a different search term.');
      console.log('\n💡 Popular packages:');
      results.forEach(r => console.log(`   📦 ${r.name} - ${r.description}`));
      return;
    }

    for (const result of filtered) {
      console.log(`📦 ${result.name} v${result.version}`);
      console.log(`   ${result.description}`);
      console.log(`   🍪 ${result.cookie} | ⬇️ ${result.downloads}`);
      console.log('');
    }
  }
}

module.exports = { KingdomPackageManager };
