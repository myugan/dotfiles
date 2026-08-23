-- ~/.config/nvim/lua/plugins/dashboard.lua
-- Requires: folke/snacks.nvim, nvim-telescope/telescope.nvim (or fzf-lua)

return {
  "folke/snacks.nvim",
  priority = 1000,
  lazy = false,
  opts = {
    dashboard = {
      width = 60,

      preset = {
        -- Blocky Neovim logo. Replace with the `image` section below
        -- if your terminal supports the kitty graphics protocol.
        header = [[
      ████ ██████           █████      ██
     ███████████             █████
     █████████ ███████████████████ ███   ███████████
    █████████  ███    █████████████ █████ ██████████████
   █████████ ██████████ █████████ █████ █████ ████ █████
 ███████████ ███    ███ █████████ █████ █████ ████ █████
██████  █████████████████████ ████ █████ █████ ████ ██████]],

        keys = {
          { icon = " ", key = "n", desc = "Create file",     action = ":ene | startinsert" },
          { icon = " ", key = "e", desc = "Explore project", action = ":lua Snacks.explorer()" },
          { icon = " ", key = "t", desc = "Find file",       action = ":Telescope find_files" },
          { icon = " ", key = "f", desc = "Find text",       action = ":Telescope live_grep" },
          { icon = " ", key = "q", desc = "Quit",            action = ":qa" },
        },
      },

      sections = {
        { section = "header" },
        { title = "DOTFILES", padding = 1 },
        { section = "keys", padding = 1 },
        { section = "startup" },
      },
    },
  },
}
