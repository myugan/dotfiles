require "nvchad.mappings"

-- add yours here

local map = vim.keymap.set

map("n", ";", ":", { desc = "CMD enter command mode" })
map("i", "jk", "<ESC>")

-- map({ "n", "i", "v" }, "<C-s>", "<cmd> w <cr>")

map("n", "<leader>tp", "<cmd>Typr<CR>", { desc = "Typing test" })
map("n", "<leader>gg", "<cmd>Neogit<CR>", { desc = "Neogit status" })

-- VSCode-style integrated terminal toggle
-- <leader>tt is the reliable one; Ctrl+` is a bonus but many terminals
-- don't send it as a distinct keycode, so don't depend on it alone.
local toggle_term = function()
  require("nvchad.term").toggle { pos = "sp", id = "vscodeTerm" }
end
map({ "n", "t" }, "<C-`>", toggle_term, { desc = "terminal toggle VSCode-style" })
map("n", "<leader>tt", toggle_term, { desc = "terminal toggle VSCode-style" })

-- Buffer/tab navigation now comes from NvChad's own tabufline defaults
-- (<Tab>/<S-Tab> next/prev, <leader>b new, <leader>x close), active
-- automatically now that tabufline.enabled is back to its default (true).

-- Jump straight to tab N (tabufline's own ordered buffer list, vim.t.bufs)
for i = 1, 9 do
  map("n", "<A-" .. i .. ">", function()
    local bufnr = vim.t.bufs[i]
    if bufnr then
      require("nvchad.tabufline").goto_buf(bufnr)
    end
  end, { desc = "buffer goto " .. i })
end
map("n", "<A-0>", function()
  local bufnr = vim.t.bufs[#vim.t.bufs]
  if bufnr then
    require("nvchad.tabufline").goto_buf(bufnr)
  end
end, { desc = "buffer goto last" })

-- Claude Code (leader-a namespace)
map("n", "<leader>ac", "<cmd>ClaudeCode<CR>", { desc = "Claude Code toggle" })
map("n", "<leader>af", "<cmd>ClaudeCodeFocus<CR>", { desc = "Claude Code focus" })
map("n", "<leader>ar", "<cmd>ClaudeCode --resume<CR>", { desc = "Claude Code resume" })
map("n", "<leader>aC", "<cmd>ClaudeCode --continue<CR>", { desc = "Claude Code continue" })
map("n", "<leader>am", "<cmd>ClaudeCodeSelectModel<CR>", { desc = "Claude Code select model" })
map("n", "<leader>ab", "<cmd>ClaudeCodeAdd %<CR>", { desc = "Claude Code add file" })
map("v", "<leader>as", "<cmd>ClaudeCodeSend<CR>", { desc = "Claude Code send selection" })
map("n", "<leader>aa", "<cmd>ClaudeCodeDiffAccept<CR>", { desc = "Claude Code diff accept" })
map("n", "<leader>ad", "<cmd>ClaudeCodeDiffDeny<CR>", { desc = "Claude Code diff deny" })

-- Window splits (creation; Ctrl+h/j/k/l already navigate between them)
map("n", "<leader>sv", "<cmd>vsplit<CR>", { desc = "split window vertical" })
map("n", "<leader>sh", "<cmd>split<CR>", { desc = "split window horizontal" })
map("n", "<leader>se", "<C-w>=", { desc = "split equalize sizes" })
map("n", "<leader>sx", "<cmd>close<CR>", { desc = "split close current" })

-- Resize splits with arrow keys
map("n", "<C-Up>", "<cmd>resize +2<CR>", { desc = "resize split up" })
map("n", "<C-Down>", "<cmd>resize -2<CR>", { desc = "resize split down" })
map("n", "<C-Left>", "<cmd>vertical resize -2<CR>", { desc = "resize split left" })
map("n", "<C-Right>", "<cmd>vertical resize +2<CR>", { desc = "resize split right" })
