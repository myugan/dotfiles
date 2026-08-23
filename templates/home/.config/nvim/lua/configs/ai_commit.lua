-- Generate a Conventional Commits message from the staged diff via the
-- `claude` CLI, then open an editable buffer with it: `:w` commits
-- using that (possibly edited) message, `:q` cancels without
-- committing. Standard git-commit-editor feel, no Neogit internals.

local M = {}

local PROMPT = [[
Write a git commit message for this staged diff, following the
Conventional Commits spec: `type(scope): subject`, where type is one
of feat/fix/chore/refactor/docs/test/style/perf/build/ci. Scope is
optional, omit it if unclear. Subject in imperative mood, under 72
chars, no trailing period. Add a short body only if the "why" isn't
obvious from the diff itself -- most commits don't need one.

Output ONLY the raw commit message text. No explanation, no markdown
code fences, no quotes around it.

Diff:
]]

local function open_commit_buffer(message)
  vim.cmd "vsplit"
  local buf = vim.api.nvim_create_buf(false, true)
  vim.api.nvim_win_set_buf(0, buf)
  vim.api.nvim_buf_set_lines(buf, 0, -1, false, vim.split(message, "\n"))
  vim.bo[buf].filetype = "gitcommit"
  vim.bo[buf].buftype = "acwrite"
  vim.bo[buf].bufhidden = "wipe"
  vim.api.nvim_buf_set_name(buf, "AI Commit Message (:w to commit, :q to cancel)")
  vim.bo[buf].modified = false

  vim.api.nvim_create_autocmd("BufWriteCmd", {
    buffer = buf,
    callback = function()
      local lines = vim.api.nvim_buf_get_lines(buf, 0, -1, false)
      local final_message = table.concat(lines, "\n")

      local tmpfile = vim.fn.tempname()
      vim.fn.writefile(vim.split(final_message, "\n"), tmpfile)
      local result = vim.fn.system { "git", "commit", "-F", tmpfile }
      vim.fn.delete(tmpfile)

      if vim.v.shell_error ~= 0 then
        vim.notify("git commit failed: " .. result, vim.log.levels.ERROR)
        return
      end

      vim.notify("Committed", vim.log.levels.INFO)
      vim.bo[buf].modified = false
      vim.cmd("bwipeout " .. buf)
    end,
  })
end

M.generate = function()
  local diff = vim.fn.system "git diff --staged"
  if vim.v.shell_error ~= 0 then
    vim.notify("Not a git repo, or git diff failed", vim.log.levels.ERROR)
    return
  end
  if diff == "" then
    vim.notify("No staged changes to commit", vim.log.levels.WARN)
    return
  end

  vim.notify("Generating commit message...", vim.log.levels.INFO)

  vim.system({ "claude", "-p", PROMPT .. diff }, { text = true }, function(result)
    vim.schedule(function()
      if result.code ~= 0 then
        vim.notify("AI commit message generation failed: " .. (result.stderr or "unknown error"), vim.log.levels.ERROR)
        return
      end

      local message = vim.trim(result.stdout or "")
      if message == "" then
        vim.notify("AI returned an empty commit message", vim.log.levels.ERROR)
        return
      end

      open_commit_buffer(message)
    end)
  end)
end

return M
