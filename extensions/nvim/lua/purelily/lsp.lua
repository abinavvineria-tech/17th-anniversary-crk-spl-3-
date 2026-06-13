local M = {}

function M.setup(opts)
  opts = opts or {}

  if not vim.lsp then
    vim.notify('PureLily: Neovim 0.8+ required for LSP', vim.log.levels.WARN)
    return
  end

  local cmd = { 'node', get_lily_path(), 'lsp', 'start' }

  vim.api.nvim_create_autocmd('FileType', {
    pattern = 'purelily',
    callback = function()
      vim.lsp.start({
        name = 'purelily-lsp',
        cmd = cmd,
        root_dir = vim.fs.root(0, { 'kingdom.json', '.purelily', '.git' }) or vim.fn.getcwd(),
        capabilities = vim.lsp.protocol.make_client_capabilities(),
        settings = {
          purelily = {
            lsp = { enabled = true },
            format = { tabSize = 4, insertSpaces = true },
          },
        },
      })
    end,
  })

  vim.api.nvim_create_autocmd('FileType', {
    pattern = 'purelily',
    callback = function()
      vim.keymap.set('n', 'K', vim.lsp.buf.hover, { buffer = true, desc = 'Hover docs' })
      vim.keymap.set('n', 'gd', vim.lsp.buf.definition, { buffer = true, desc = 'Go to definition' })
      vim.keymap.set('n', 'gD', vim.lsp.buf.declaration, { buffer = true, desc = 'Go to declaration' })
      vim.keymap.set('n', 'gr', vim.lsp.buf.references, { buffer = true, desc = 'Find references' })
      vim.keymap.set('n', 'gi', vim.lsp.buf.implementation, { buffer = true, desc = 'Go to implementation' })
      vim.keymap.set('n', '<leader>rn', vim.lsp.buf.rename, { buffer = true, desc = 'Rename symbol' })
      vim.keymap.set('n', '<leader>ca', vim.lsp.buf.code_action, { buffer = true, desc = 'Code action' })
      vim.keymap.set('n', '<leader>f', function()
        vim.lsp.buf.format({ async = true })
      end, { buffer = true, desc = 'Format' })
      vim.keymap.set('n', '<leader>e', vim.diagnostic.open_float, { buffer = true, desc = 'Show diagnostic' })
      vim.keymap.set('n', '[d', vim.diagnostic.goto_prev, { buffer = true, desc = 'Prev diagnostic' })
      vim.keymap.set('n', ']d', vim.diagnostic.goto_next, { buffer = true, desc = 'Next diagnostic' })
    end,
  })
end

function get_lily_path()
  local paths = {
    vim.fn.expand('~/.local/share/nvim/lazy/purelily-17/src/cli/index.js'),
    vim.fn.expand(vim.fn.stdpath('config') .. '/lua/purelily/../../src/cli/index.js'),
  }
  for _, p in ipairs(paths) do
    p = vim.fn.resolve(p)
    if vim.fn.filereadable(p) == 1 then
      return p
    end
  end
  return vim.fn.expand('~/.local/share/nvim/mason/packages/purelily-17/src/cli/index.js')
end

return M
