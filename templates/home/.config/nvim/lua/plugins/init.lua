return {
  {
    "stevearc/conform.nvim",
    -- event = 'BufWritePre', -- uncomment for format on save
    opts = require "configs.conform",
  },

  {
    "mfussenegger/nvim-lint",
    event = { "BufReadPost", "BufNewFile" },
    config = function()
      require "configs.lint"
    end,
  },

  -- These are some examples, uncomment them if you want to see them work!
  {
    "neovim/nvim-lspconfig",
    dependencies = { "mason-org/mason-lspconfig.nvim" },
    config = function()
      require "configs.lspconfig"
    end,
  },

  -- test new blink
  -- { import = "nvchad.blink.lazyspec" },

  {
    "nvzone/typr",
    dependencies = "nvzone/volt",
    opts = {},
    cmd = { "Typr", "TyprStats" },
  },

  {
    "lukas-reineke/indent-blankline.nvim",
    main = "ibl",
    event = { "BufReadPost", "BufNewFile" },
    opts = {},
  },

  {
    "rachartier/tiny-inline-diagnostic.nvim",
    event = "VeryLazy",
    priority = 1000,
    config = function()
      require("tiny-inline-diagnostic").setup()
      vim.diagnostic.config { virtual_text = false }
    end,
  },

  {
    "NeogitOrg/neogit",
    dependencies = {
      "nvim-lua/plenary.nvim",
      "sindrets/diffview.nvim",
      "nvim-tree/nvim-web-devicons",
    },
    cmd = "Neogit",
    opts = {},
  },

  {
    "akinsho/bufferline.nvim",
    event = "VeryLazy",
    dependencies = "nvim-tree/nvim-web-devicons",
    opts = {
      options = {
        diagnostics = "nvim_lsp",
        offsets = {
          { filetype = "NvimTree", text = "File Explorer", highlight = "Directory", text_align = "left" },
        },
      },
    },
  },

  {
    "nvim-lualine/lualine.nvim",
    event = "VeryLazy",
    dependencies = "nvim-tree/nvim-web-devicons",
    opts = function()
      -- "auto" was picking a light theme on startup (highlight groups not
      -- settled yet when lualine loaded); build the theme directly from
      -- NvChad's nightowl palette instead so it's reliably dark.
      local c = require("base46.themes.nightowl").base_30

      local nightowl_lualine = {
        normal = {
          a = { fg = c.black, bg = c.blue, gui = "bold" },
          b = { fg = c.white, bg = c.one_bg2 },
          c = { fg = c.white, bg = c.statusline_bg },
        },
        insert = { a = { fg = c.black, bg = c.green, gui = "bold" } },
        visual = { a = { fg = c.black, bg = c.purple, gui = "bold" } },
        replace = { a = { fg = c.black, bg = c.red, gui = "bold" } },
        command = { a = { fg = c.black, bg = c.yellow, gui = "bold" } },
        inactive = {
          a = { fg = c.light_grey, bg = c.statusline_bg },
          b = { fg = c.light_grey, bg = c.statusline_bg },
          c = { fg = c.light_grey, bg = c.statusline_bg },
        },
      }

      return {
        options = { theme = nightowl_lualine, globalstatus = true },
      }
    end,
  },

  {
    "rachartier/tiny-devicons-auto-colors.nvim",
    dependencies = "nvim-tree/nvim-web-devicons",
    event = "VeryLazy",
    config = function()
      require("tiny-devicons-auto-colors").setup()
    end,
  },

  -- Claude Code IDE integration
  {
    "folke/snacks.nvim",
    lazy = true,
  },
  {
    "coder/claudecode.nvim",
    dependencies = { "folke/snacks.nvim" },
    cmd = { "ClaudeCode", "ClaudeCodeFocus", "ClaudeCodeAdd", "ClaudeCodeSend", "ClaudeCodeSelectModel", "ClaudeCodeDiffAccept", "ClaudeCodeDiffDeny" },
    opts = {},
  },

  -- {
  -- 	"nvim-treesitter/nvim-treesitter",
  -- 	opts = {
  -- 		ensure_installed = {
  -- 			"vim", "lua", "vimdoc",
  --      "html", "css"
  -- 		},
  -- 	},
  -- },
}
