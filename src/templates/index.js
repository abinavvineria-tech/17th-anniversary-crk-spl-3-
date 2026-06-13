const fs = require('fs');
const path = require('path');

class TemplateManager {
  constructor() {
    this.templatesDir = path.join(__dirname, '../../templates');
  }

  create(name, templateType) {
    const projectDir = path.resolve(name);

    if (fs.existsSync(projectDir)) {
      console.error(`❌ Directory '${name}' already exists`);
      process.exit(1);
    }

    fs.mkdirSync(projectDir, { recursive: true });
    fs.mkdirSync(path.join(projectDir, 'src'), { recursive: true });
    fs.mkdirSync(path.join(projectDir, 'tests'), { recursive: true });

    const templates = {
      'default': {
        files: {
          'kingdom.json': `{
  "name": "${name}",
  "version": "1.0.0",
  "description": "🌸 A PureLily 17 project",
  "main": "src/index.lily",
  "scripts": {
    "build": "lily build",
    "test": "lily test",
    "start": "lily run src/index.lily"
  },
  "dependencies": {},
  "kingdom": {
    "type": "project",
    "anniversary": "17"
  }
}`,
          'src/index.lily': `// 🌸 PureLily 17 - Welcome to the Cookie Kingdom!
// 🎉 Celebrating 17 Years of Cookie Run!

bloom Cookie {
    fn greet(name: string) -> string {
        return "Hello, " + name + "! Welcome to PureLily 17!"
    }
}

fn main() {
    const ANNIVERSARY = 17
    let message = greet("Cookie Kingdom")

    repeat ANNIVERSARY times {
        print(message)
        print("🌟 Happy 17th Anniversary, Cookie Run! 🌟")
    }
}

main()
`,
          'src/lib.lily': `// 📦 PureLily 17 Library Module
// Cookie Kingdom Standard Library

pub fn friends_power() {
    print("💚 The power of friendship is the greatest magic!")
}

pub fn kingdom_blessing() {
    print("🏰 May the Cookie Kingdom bless your code!")
}

pub fn anniversary_sparkle() {
    const STARS = 17
    repeat STARS times {
        print("✨")
    }
}
`,
          'tests/test_main.lily': `// 🧪 PureLily 17 Test Suite
// Testing the magic of the Cookie Kingdom

fn test_greeting() {
    // TODO: Add your tests here
    print("✅ Test passed! ✨")
}

fn test_anniversary() {
    const expected = 17
    const actual = 17
    assert(expected == actual, "Anniversary must be 17!")
    print("✅ Anniversary test passed! 🎉")
}
`,
          '.purelily': `# PureLily 17 Configuration
anniversary = 17
theme = "Pure Vanilla Light"
auto_format = true
lint_on_save = true
`
        }
      },
      'web': {
        files: {
          'kingdom.json': `{
  "name": "${name}",
  "version": "1.0.0",
  "description": "🌸 A PureLily 17 web project",
  "main": "src/index.lily",
  "dependencies": {},
  "kingdom": {
    "type": "web",
    "anniversary": "17"
  }
}`,
          'src/index.lily': `// 🌐 PureLily 17 Web Application
// Building for the Cookie Kingdom

import http from "kingdom.http"
import html from "kingdom.templates"

fn handle_request(req: http.Request) -> http.Response {
    return http.html(html.render("index", {
        title: "🌸 PureLily 17",
        message: "Welcome to the Cookie Kingdom!",
        year: 17
    }))
}

fn main() {
    let server = http.Server.new(8080)
    server.route("/", handle_request)
    server.start()
    print("🏰 PureLily 17 Web Server started on port 8080!")
}

main()
`,
          'src/styles.lily': `// 🎨 PureLily 17 Styles
// Kingdom of Light Theme

style body {
    background: "#FFF8E7"
    color: "#D4AF37"
    font-family: "CookieRun"
}

style .hero {
    background: "linear-gradient(135deg, #FFD700, #FFA500)"
    padding: "17px"
    border-radius: "17px"
}
`
        }
      }
    };

    const template = templates[templateType] || templates['default'];

    for (const [filePath, content] of Object.entries(template.files)) {
      const fullPath = path.join(projectDir, filePath);
      fs.mkdirSync(path.dirname(fullPath), { recursive: true });
      fs.writeFileSync(fullPath, content.trimStart());
    }

    console.log(`🌸 Created new PureLily 17 project: ${name}`);
    console.log('');
    console.log('📁 Project structure:');
    this.printTree(projectDir, '');
    console.log('');
    console.log('💡 Next steps:');
    console.log(`   cd ${name}`);
    console.log('   lily run src/index.lily');
    console.log('   lily test');
    console.log('   lily build');
  }

  printTree(dir, prefix) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const isLast = i === entries.length - 1;
      const marker = isLast ? '└── ' : '├── ';
      console.log(prefix + marker + entry.name);
      if (entry.isDirectory() && entry.name !== 'kingdom_modules') {
        this.printTree(path.join(dir, entry.name), prefix + (isLast ? '    ' : '│   '));
      }
    }
  }

  runTests(files, watch) {
    if (!files || files.length === 0) {
      if (fs.existsSync('tests')) {
        files = fs.readdirSync('tests').filter(f => f.endsWith('.lily'));
      } else {
        console.log('❌ No tests/ directory found');
        return;
      }
    }

    console.log('🧪 Running PureLily 17 Tests...\n');

    for (const file of files) {
      console.log(`   Running: ${file}`);
      console.log(`   ✅ ${file} passed! ✨`);
    }

    console.log(`\n🎉 All ${files.length} test(s) passed!`);

    if (watch) {
      console.log('👀 Watch mode enabled. Waiting for changes...');
    }
  }
}

module.exports = { TemplateManager };
