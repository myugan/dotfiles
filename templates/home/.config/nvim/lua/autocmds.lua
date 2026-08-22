require "nvchad.autocmds"

-- Open the file explorer (nvim-tree) on startup, cursor back in the
-- real buffer if one was opened (e.g. `nvim somefile.lua`).
vim.api.nvim_create_autocmd("VimEnter", {
  callback = function()
    local had_file = vim.fn.argc() > 0
    vim.cmd "NvimTreeFocus"
    if had_file then
      vim.cmd "wincmd p"
    end
  end,
})

-- Smart `:q`: if the nvim-tree sidebar is open, `:q` quits nvim
-- entirely in one shot (sidebar included) instead of leaving it
-- as an orphan window. Otherwise behaves like a normal `:q`.
_G.SmartQuit = function()
  local tree_open = false
  for _, win in ipairs(vim.api.nvim_list_wins()) do
    local buf = vim.api.nvim_win_get_buf(win)
    if vim.api.nvim_get_option_value("filetype", { buf = buf }) == "NvimTree" then
      tree_open = true
      break
    end
  end

  local ok, err = pcall(vim.cmd, tree_open and "qa" or "q")
  if not ok then
    -- Strip the Lua wrapper noise, show the same clean message :qa would.
    local msg = err:match("E%d+:.*$") or err
    vim.api.nvim_err_writeln(msg)
  end
end

vim.cmd [[cnoreabbrev <expr> q (getcmdtype() == ':' && getcmdline() == 'q') ? 'lua SmartQuit()' : 'q']]
