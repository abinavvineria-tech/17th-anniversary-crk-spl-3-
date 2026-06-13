# 🌸 PureLily 17 Installation Guide

🎉 *Celebrating 17 Years of Cookie Run*

---

## 📋 Requirements

- **Node.js** 18+ (LTS recommended)
- **npm** 9+
- **Git** (for development)

---

## 🚀 Quick Install (npm)

```bash
npm install -g purelily-17
```

Verify:
```bash
lily --version
lily --help
```

---

## 📦 Manual Install (from source)

```bash
# Clone or copy the project
cd ~/Projects
# copy the purelily-17 directory to ~/Projects
cd purelily-17

# Install dependencies
npm install

# Link globally (optional)
npm link
```

On **Termux** (Android), `npm link` may not work due to `/usr/bin/env` path differences. Use an alias instead:

```bash
alias lily='node /path/to/purelily-17/src/cli/index.js'
```

Add to `~/.zshrc` or `~/.bashrc` to make it permanent.

---

## 🖥️ Editor Setup

### VS Code

**Option A — Install from VSIX:**
```bash
cd extensions/vscode
npx vsce package
code --install-extension purelily-17-*.vsix
```

**Option B — Copy to extensions folder:**
```bash
cp -r extensions/vscode ~/.vscode/extensions/purelily-17
```

**Option C — Development mode:**
1. Open `extensions/vscode/` in VS Code
2. Press `F5` to launch Extension Development Host
3. Open any `.lily` file

Features: syntax highlighting, 12 themes, snippets, LSP.

### Neovim

**Option A — Plugin manager (lazy.nvim):**
```lua
{
  dir = '/path/to/purelily-17/extensions/nvim',
  name = 'purelily-17',
  ft = { 'purelily', 'lily' },
  opts = {
    lsp = { enabled = true },
    treesitter = { enabled = false },
  },
}
```

**Option B — Manual symlinks:**
```bash
# Syntax highlighting
ln -sf /path/to/purelily-17/extensions/nvim/syntax/purelily.vim \
  ~/.config/nvim/syntax/purelily.vim

# Filetype detection
ln -sf /path/to/purelily-17/extensions/nvim/ftdetect/purelily.lua \
  ~/.config/nvim/ftdetect/purelily.lua

# Full plugin (optional)
ln -sf /path/to/purelily-17/extensions/nvim/lua/purelily \
  ~/.config/nvim/lua/purelily
ln -sf /path/to/purelily-17/extensions/nvim/plugin/purelily.lua \
  ~/.config/nvim/plugin/purelily.lua
```

**Option C — Manual config (init.lua):**
```lua
-- Filetype detection
vim.filetype.add({
  extension = { lily = 'purelily', purelily = 'purelily', pl = 'purelily' },
})

-- LSP setup (requires node)
vim.api.nvim_create_autocmd('FileType', {
  pattern = 'purelily',
  callback = function()
    vim.lsp.start({
      name = 'purelily-lsp',
      cmd = { 'node', '/path/to/purelily-17/src/cli/index.js', 'lsp', 'start' },
      root_dir = vim.fs.root(0, { 'kingdom.json', '.purelily' }) or vim.fn.getcwd(),
    })
  end,
})
```

### Vim

```bash
# Syntax highlighting
ln -sf /path/to/purelily-17/extensions/nvim/syntax/purelily.vim \
  ~/.vim/syntax/purelily.vim

# Filetype detection
echo 'au BufRead,BufNewFile *.lily set filetype=purelily' >> ~/.vimrc
echo 'au BufRead,BufNewFile *.purelily set filetype=purelily' >> ~/.vimrc
```

For LSP, use coc.nvim:
```json
// coc-settings.json
{
  "languageserver": {
    "purelily": {
      "command": "node",
      "args": ["/path/to/purelily-17/src/cli/index.js", "lsp", "start"],
      "filetypes": ["purelily"],
      "rootPatterns": ["kingdom.json", ".purelily"]
    }
  }
}
```

### Helix

Add to `~/.config/helix/languages.toml`:
```toml
[[language]]
name = "purelily"
scope = "source.purelily"
file-types = ["lily", "purelily", "pl"]
comment-token = "//"
indent = { tab-width = 4, unit = "    " }

[language.language-server]
command = "node"
args = ["/path/to/purelily-17/src/cli/index.js", "lsp", "start"]

[[grammar]]
name = "purelily"
source = { git = "cookie-kingdom/tree-sitter-purelily", rev = "main" }
```

### Zed

Add to `~/.config/zed/settings.json`:
```json
{
  "languages": {
    "PureLily": {
      "file_types": [".lily", ".purelily", ".pl"],
      "language_servers": ["purelily-lsp"]
    }
  },
  "language_servers": {
    "purelily-lsp": {
      "command": {
        "path": "node",
        "args": ["/path/to/purelily-17/src/cli/index.js", "lsp", "start"]
      }
    }
  }
}
```

### Emacs

```elisp
;; Syntax highlighting
(use-package purelily-mode
  :ensure nil
  :config
  (define-derived-mode purelily-mode prog-mode "PureLily"
    "Major mode for PureLily 17"
    (setq font-lock-defaults '(purelily-font-lock-keywords)))
  (add-to-list 'auto-mode-alist '("\\.lily\\'" . purelily-mode))
  (add-to-list 'auto-mode-alist '("\\.purelily\\'" . purelily-mode)))

;; LSP via eglot
(use-package eglot
  :config
  (add-to-list 'eglot-server-programs
               '(purelily-mode . ("node" "/path/to/purelily-17/src/cli/index.js" "lsp" "start"))))
```

### JetBrains IDEs

1. Open **Settings → Languages & Frameworks → Language Servers**
2. Click **+** to add a new server
3. Set:
   - **Name:** PureLily LSP
   - **Command:** `node /path/to/purelily-17/src/cli/index.js lsp start`
4. Map to file types: `*.lily`, `*.purelily`, `*.pl`

### OpenCode

OpenCode has native LSP support. Configure in `opencode.json`:
```json
{
  "languages": {
    "purelily": {
      "languageServer": {
        "command": "node",
        "args": ["/path/to/purelily-17/src/cli/index.js", "lsp", "start"]
      }
    }
  }
}
```

---

## 🐛 Troubleshooting

### "command not found: lily"
```bash
# Use direct path instead
node /path/to/purelily-17/src/cli/index.js --help

# Or set up an alias
alias lily='node /path/to/purelily-17/src/cli/index.js'
```

### "Cannot find module 'commander'"
```bash
cd /path/to/purelily-17
npm install
```

### LSP not starting
```bash
# Test directly
node /path/to/purelily-17/src/cli/index.js lsp start
# Expected output:
# 🌸 PureLily Language Server Started
# 🍦 Pure Vanilla Analysis Engine Enabled
# 🌿 White Lily Knowledge Engine Enabled
# ⏳ Timekeeper Timeline Index Ready
# ✨ Cookie Kingdom Development Environment Ready
```

### Syntax highlighting not working
- Ensure file extension is `.lily`, `.purelily`, or `.pl`
- Restart your editor after linking syntax files
- Check editor logs for any errors

---

## 📁 Project Structure

```
purelily-17/
├── src/
│   ├── cli/index.js           ← CLI entry point
│   ├── lsp/                   ← Language Server
│   ├── package_manager/       ← Kingdom PM
│   ├── templates/             ← Project templates
│   ├── debugger/              ← Interactive debugger
│   └── themes/generator.js    ← Theme generator
├── extensions/
│   ├── vscode/                ← VS Code extension
│   └── nvim/                  ← Neovim plugin
├── syntaxes/                  ← TextMate grammar
├── examples/                  ← Sample programs
└── docs/                      ← Documentation site
```

---

*"Friendship is the greatest magic of all."* — Pure Vanilla Cookie
