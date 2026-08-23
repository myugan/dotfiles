-- Cloned from the "chadsheet" iTerm2 color preset (the one actually
-- applied/in-use), so nvim's UI (editor, statusline, tabufline,
-- telescope, etc.) matches the terminal exactly.
--
-- Every accent color maps to a real "Ansi N Color" from the preset.
-- The gray staircase (panel/statusline shades) is interpolated between
-- the real background and the real "Ansi 8" grey, not an invented value.

local M = {}

M.base_30 = {
  white = "#cdd4df", -- main text (Foreground Color)
  darker_black = "#0b1219",
  black = "#131a21", -- nvim bg (Background Color)
  black2 = "#181f26",
  one_bg = "#1e242c",
  one_bg2 = "#232a31",
  one_bg3 = "#262d34",
  grey = "#2a3138",
  grey_fg = "#2f363d",
  grey_fg2 = "#31383f",
  light_grey = "#363d44", -- ansi 8
  red = "#ef8790", -- ansi 1
  baby_pink = "#fba1aa", -- ansi 9
  pink = "#d3bceb", -- ansi 13
  line = "#232a31", -- vertsplit etc
  green = "#9ee8c3", -- ansi 2
  vibrant_green = "#afcfc3", -- ansi 10
  nord_blue = "#b5c3e9", -- ansi 12
  blue = "#99aee4", -- ansi 4
  yellow = "#fbdf90", -- ansi 3
  sun = "#fde8ac", -- ansi 11
  purple = "#c1a1e2", -- ansi 5
  dark_purple = "#9a5dda",
  teal = "#91dbb5", -- ansi 6
  orange = "#f6b790", -- blend of ansi 1 + ansi 3
  cyan = "#9edde8", -- ansi 14
  statusline_bg = "#181f26",
  lightbg = "#1e242c",
  pmenu_bg = "#363d44", -- ansi 8
  folder_bg = "#99aee4",
}

M.base_16 = {
  base00 = "#131a21",
  base01 = "#181f26",
  base02 = "#1e242c",
  base03 = "#262d34",
  base04 = "#2a3138",
  base05 = "#cdd4df",
  base06 = "#e8ebf2", -- ansi 15
  base07 = "#e8ebf2",
  base08 = "#ef8790",
  base09 = "#f6b790",
  base0A = "#fbdf90",
  base0B = "#9ee8c3",
  base0C = "#91dbb5",
  base0D = "#99aee4",
  base0E = "#c1a1e2",
  base0F = "#9a5dda",
}

M.type = "dark"

M.polish_hl = {
  defaults = {
    Comment = { fg = "#363d44" }, -- ansi 8
    FloatBorder = { fg = M.base_16.base05 },
    Visual = { bg = "#343f52" }, -- real Selection Color
    Cursor = { fg = M.base_30.black, bg = "#9ee8c3" }, -- real Cursor Color
  },
}

M = require("base46").override_theme(M, "iterm-match")

return M
