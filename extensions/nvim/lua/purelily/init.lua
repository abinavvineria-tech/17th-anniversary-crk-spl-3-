local M = {}

function M.setup(opts)
  opts = opts or {}

  require('purelily.lsp').setup(opts.lsp or {})
  require('purelily.treesitter').setup(opts.treesitter or {})

  vim.api.nvim_create_autocmd('FileType', {
    pattern = 'purelily',
    callback = function()
      vim.bo.commentstring = '// %s'
      vim.bo.tabstop = 4
      vim.bo.shiftwidth = 4
      vim.bo.expandtab = true
      vim.bo.softtabstop = 4
      vim.bo.suffixesadd = '.lily'
      vim.bo.include = '\\v<import\\s+\\w+\\s+from\\s+"\\zs[^"]+'
      vim.bo.define = '\\v<(fn|class|struct|enum|trait|let|const)\\s+\\zs[^( ]+'
      vim.bo.iskeyword = '@,48-57,_,192-255'
      vim.bo.formatoptions = 'croql'
    end,
  })

  vim.api.nvim_create_user_command('LilyRun', function(t)
    local file = t.args or vim.fn.expand('%')
    vim.cmd('!node ' .. get_cli_path() .. ' run ' .. file)
  end, { nargs = '?', complete = 'file' })

  vim.api.nvim_create_user_command('LilyNew', function(t)
    vim.cmd('!node ' .. get_cli_path() .. ' new ' .. t.args)
  end, { nargs = 1 })

  vim.api.nvim_create_user_command('LilyTest', function()
    vim.cmd('!node ' .. get_cli_path() .. ' test')
  end, { nargs = 0 })

  vim.api.nvim_create_user_command('LilyLint', function()
    vim.cmd('!node ' .. get_cli_path() .. ' lint ' .. vim.fn.expand('%'))
  end, { nargs = 0 })

  vim.api.nvim_create_user_command('LilyFormat', function()
    vim.cmd('!node ' .. get_cli_path() .. ' format ' .. vim.fn.expand('%'))
  end, { nargs = 0 })
end

function get_cli_path()
  local paths = {
    vim.fn.expand('~/.local/share/nvim/lazy/purelily-17/src/cli/index.js'),
    vim.fn.expand('~/.config/nvim/lua/purelily/../../src/cli/index.js'),
    vim.fn.expand(vim.fn.stdpath('config') .. '/lua/purelily/../../src/cli/index.js'),
  }
  for _, p in ipairs(paths) do
    p = vim.fn.resolve(p)
    if vim.fn.filereadable(p) == 1 then
      return p
    end
  end
  return 'lily'
end

function M.colors()
  local group = vim.api.nvim_create_augroup('PureLilyColors', { clear = true })
  vim.api.nvim_create_autocmd('ColorScheme', {
    group = group,
    pattern = '*',
    callback = function()
      local hl = vim.api.nvim_set_hl
      hl(0, 'lilyKeyword', { fg = '#D4AF37', bold = true })
      hl(0, 'lilyString', { fg = '#2ECC71' })
      hl(0, 'lilyNumber', { fg = '#F1C40F' })
      hl(0, 'lilyFunction', { fg = '#F5DEB3' })
      hl(0, 'lilyType', { fg = '#C0392B', bold = true })
      hl(0, 'lilyModule', { fg = '#4A90D9' })
      hl(0, 'lilyComment', { fg = '#1ABC9C', italic = true })
      hl(0, 'lilyConstant', { fg = '#B8860B', bold = true })
      hl(0, 'lilyAsync', { fg = '#8B5CF6', bold = true })
      hl(0, 'lilyError', { fg = '#FF6B35', bold = true })
      hl(0, 'lilyWarning', { fg = '#9B59B6' })
      hl(0, 'lilySuccess', { fg = '#2ECC71', bold = true })
      hl(0, 'lilyOperator', { fg = '#D4AF37' })
    end,
  })
end

return M
