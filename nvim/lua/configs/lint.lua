local lint = require "lint"

lint.linters_by_ft = {
  terraform = { "tflint" },
  tf = { "tflint" },
}

vim.api.nvim_create_autocmd({ "BufWritePost", "BufReadPost", "InsertLeave" }, {
  callback = function()
    lint.try_lint()
  end,
})

-- Auto-install tflint via mason so `tflint` is on PATH
local ok, mason_registry = pcall(require, "mason-registry")
if ok and mason_registry.has_package "tflint" then
  local pkg = mason_registry.get_package "tflint"
  if not pkg:is_installed() then
    pcall(function()
      pkg:install()
    end)
  end
end
