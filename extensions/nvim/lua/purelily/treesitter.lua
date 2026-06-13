local M = {}

function M.setup(opts)
  opts = opts or {}

  local ok, ts = pcall(require, 'nvim-treesitter')
  if not ok then
    vim.notify('PureLily: nvim-treesitter not found, using built-in syntax', vim.log.levels.INFO)
    M.setup_syntax()
    return
  end

  vim.treesitter.language.register('purelily', 'purelily')

  local parser_config = require('nvim-treesitter.parsers').get_parser_configs()
  parser_config.purelily = {
    install_info = {
      url = 'https://github.com/cookie-kingdom/tree-sitter-purelily',
      files = { 'src/parser.c', 'src/scanner.c' },
      branch = 'main',
    },
    filetype = 'purelily',
    used_by = { 'lily', 'purelily' },
  }
end

function M.setup_syntax()
  if vim.fn.has('nvim-0.10') == 1 then
    vim.treesitter.start = function() end
  end

  vim.api.nvim_create_autocmd('FileType', {
    pattern = 'purelily',
    callback = function()
      vim.bo.syntax = 'purelily'
    end,
  })
end

return M
