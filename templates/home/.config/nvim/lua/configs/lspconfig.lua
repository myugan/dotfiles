require("nvchad.configs.lspconfig").defaults()

-- read :h vim.lsp.config for changing options of lsp servers

-- mason.nvim itself is already configured (PATH="skip", UI icons) by
-- NvChad's own plugin spec; `require`-ing it here just ensures it's
-- loaded before mason-lspconfig, without calling .setup() a second time.
require "mason"
require("mason-lspconfig").setup {
  automatic_enable = true, -- auto vim.lsp.enable() once a server is installed
}

-- Auto-install the right LSP server the first time a filetype is opened,
-- so completion works for any language without manual `:Mason` setup.
local preferred_servers = {
  lua = "lua_ls",
  python = "pyright",
  javascript = "ts_ls",
  javascriptreact = "ts_ls",
  typescript = "ts_ls",
  typescriptreact = "ts_ls",
  go = "gopls",
  rust = "rust_analyzer",
  c = "clangd",
  cpp = "clangd",
  ruby = "ruby_lsp",
  java = "jdtls",
  sh = "bashls",
  bash = "bashls",
  html = "html",
  css = "cssls",
  json = "jsonls",
  yaml = "yamlls",
  markdown = "marksman",
  terraform = "terraformls",
  tf = "terraformls",
}

local attempted_ft = {}
vim.api.nvim_create_autocmd("FileType", {
  callback = function(args)
    local ft = args.match
    if ft == "" or attempted_ft[ft] then
      return
    end
    attempted_ft[ft] = true

    local ok, mlsp = pcall(require, "mason-lspconfig")
    if not ok then
      return
    end
    local mappings = mlsp.get_mappings().lspconfig_to_package

    local server = preferred_servers[ft]
    if not (server and mappings[server]) then
      local available = mlsp.get_available_servers { filetype = ft }
      server = available[1]
    end
    if not server then
      return
    end

    local pkg_name = mappings[server]
    if not pkg_name then
      return
    end

    local registry_ok, mason_registry = pcall(require, "mason-registry")
    if not registry_ok or not mason_registry.has_package(pkg_name) then
      return
    end

    local pkg = mason_registry.get_package(pkg_name)
    if not pkg:is_installed() then
      pcall(function()
        pkg:install()
      end)
    end
  end,
})
