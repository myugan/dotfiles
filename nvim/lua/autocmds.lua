require "nvchad.autocmds"

-- Open the file explorer (nvim-tree) on startup, but only when opening
-- an actual file/directory (e.g. `nvim somefile.lua`). With no
-- arguments at all, leave the empty buffer alone so the snacks
-- dashboard can render instead -- it needs that first empty buffer
-- undisturbed to show up.
vim.api.nvim_create_autocmd("VimEnter", {
  callback = function()
    if vim.fn.argc() > 0 then
      vim.cmd "NvimTreeFocus"
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

-- Markdown preview toggle: <leader>mp, buffer-local to markdown files only.
-- Leader-prefixed (space, not Cmd/Ctrl) so it can't collide with any
-- macOS system or terminal-app shortcut -- those all use Cmd (which
-- terminal nvim never even receives) or Ctrl combos, never bare leader.
vim.api.nvim_create_autocmd("FileType", {
  pattern = "markdown",
  callback = function(args)
    vim.keymap.set("n", "<leader>mp", "<cmd>MarkdownPreviewToggle<CR>", {
      buffer = args.buf,
      desc = "markdown preview toggle",
    })
  end,
})

-- Auto-reload nvim config: any .lua file saved under this config dir
-- gets re-sourced immediately, no restart needed to see the change.
vim.api.nvim_create_autocmd("BufWritePost", {
  pattern = vim.fn.stdpath "config" .. "/**/*.lua",
  callback = function(args)
    vim.cmd("source " .. args.file)
    vim.notify("Reloaded " .. vim.fn.fnamemodify(args.file, ":~:."), vim.log.levels.INFO, { title = "nvim config" })
  end,
})
