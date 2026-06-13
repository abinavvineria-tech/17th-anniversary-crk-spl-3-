-- 🌸 PureLily 17 - Neovim Plugin
-- 🎉 Celebrating 17 Years of Cookie Run!

if vim.g.loaded_purelily then
  return
end
vim.g.loaded_purelily = true

local purelily = require('purelily')

purelily.colors()

vim.api.nvim_create_user_command('Lily', function(t)
  local args = t.args
  vim.cmd('!node ' .. get_lily_nvim_path() .. ' ' .. args)
end, { nargs = '+', complete = 'file' })

function get_lily_nvim_path()
  local base = vim.fn.resolve(vim.fn.stdpath('config') .. '/lua/purelily/../../src/cli/index.js')
  if vim.fn.filereadable(base) == 1 then
    return base
  end
  return vim.fn.expand('~/.local/share/nvim/lazy/purelily-17/src/cli/index.js')
end

local group = vim.api.nvim_create_augroup('PureLilyNvim', { clear = true })

vim.api.nvim_create_autocmd('FileType', {
  group = group,
  pattern = 'purelily',
  callback = function()
    vim.bo.commentstring = '// %s'
    vim.bo.tabstop = 4
    vim.bo.shiftwidth = 4
    vim.bo.expandtab = true

    vim.keymap.set('n', '<F5>', ':Lily run %<CR>', { buffer = true, silent = true, desc = 'Run file' })
    vim.keymap.set('n', '<F6>', ':Lily lint %<CR>', { buffer = true, silent = true, desc = 'Lint file' })
    vim.keymap.set('n', '<F7>', ':Lily format %<CR>', { buffer = true, silent = true, desc = 'Format file' })
    vim.keymap.set('n', '<F8>', ':Lily test<CR>', { buffer = true, silent = true, desc = 'Run tests' })
    vim.keymap.set('n', '<leader>le', ':Lily encyclopedia<CR>', { buffer = true, silent = true, desc = 'Cookie encyclopedia' })
  end,
})
