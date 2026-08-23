-- Cloned from the active iTerm2 profile's actual palette, so nvim's UI
-- (editor, statusline, tabufline, telescope, etc.) matches the terminal
-- exactly instead of an unrelated bundled theme.

local M = {}

M.base_30 = {
  white = "#101010", -- main text (iTerm2 foreground)
  darker_black = "#f4f4f4",
  black = "#f9f9f9", -- nvim bg (iTerm2 background)
  black2 = "#f0f0f0",
  one_bg = "#e4e4e4",
  one_bg2 = "#e1e1e1",
  one_bg3 = "#dbdbdc",
  grey = "#c9c9ca",
  grey_fg = "#c5c5c5",
  grey_fg2 = "#c1c1c2",
  light_grey = "#bebebf",
  red = "#b43c29", -- ansi 1
  baby_pink = "#dc7974", -- ansi 9
  pink = "#e07de0", -- ansi 13
  line = "#e1e1e1", -- vertsplit etc
  green = "#00c200", -- ansi 2
  vibrant_green = "#57e690", -- ansi 10
  nord_blue = "#a6aaf1", -- ansi 12
  blue = "#2743c7", -- ansi 4
  yellow = "#c7c400", -- ansi 3
  sun = "#ece100", -- ansi 11
  purple = "#bf3fbd", -- ansi 5
  dark_purple = "#9a3296",
  teal = "#00c5c7", -- ansi 6
  orange = "#c1591a",
  cyan = "#5ffdff", -- ansi 14
  statusline_bg = "#f0f0f0",
  lightbg = "#e4e4e4",
  pmenu_bg = "#676767", -- ansi 8
  folder_bg = "#2743c7",
}

M.base_16 = {
  base00 = "#f9f9f9",
  base01 = "#f4f4f4",
  base02 = "#e4e4e4",
  base03 = "#dbdbdc",
  base04 = "#c9c9ca",
  base05 = "#101010",
  base06 = "#000000",
  base07 = "#000000",
  base08 = "#b43c29",
  base09 = "#c1591a",
  base0A = "#c7c400",
  base0B = "#00c200",
  base0C = "#00c5c7",
  base0D = "#2743c7",
  base0E = "#bf3fbd",
  base0F = "#9a3296",
}

M.type = "light"

M.polish_hl = {
  defaults = {
    Comment = { fg = "#676767" }, -- ansi 8, matches terminal's actual muted grey
    FloatBorder = { fg = M.base_16.base05 },
  },
}

M = require("base46").override_theme(M, "iterm-match")

return M
