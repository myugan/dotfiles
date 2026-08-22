# nvim config (NvChad-based)

## Setup

Prerequisites:
- Neovim >= 0.11
- git
- A **full-coverage Nerd Font** installed and set as your terminal font (see "Font setup" below — this matters more than it sounds)
- `ripgrep` (`brew install ripgrep`) for Telescope live grep
- Internet access on first launch (plugins + language servers auto-install)

### Font setup

The sidebar, tabs, and status line all use icon glyphs from a "Nerd Font." Not every Nerd Font build includes every icon set — some narrower/condensed builds (e.g. `3270 Nerd Font`) strip out the newer **Material Design Icons** range to save space, which shows up as broken boxes/tofu specifically in the tab bar (other icons elsewhere may still look fine, which makes it confusing to diagnose).

To avoid that, install a full-coverage font:
```sh
brew install --cask font-jetbrains-mono-nerd-font
```

Then in your terminal app, set it as the font used for non-ASCII/icon characters:

**iTerm2:**
1. Settings (`Cmd+,`) → Profiles → your profile → **Text** tab
2. Enable "Use a different font for non-ASCII text" if not already on
3. Set **Non-ASCII Font** to `JetBrainsMono Nerd Font`, size to match your normal font
4. Restart iTerm2

(Other terminals: just set the whole terminal font to a Nerd Font build — most don't split ASCII/non-ASCII the way iTerm2 does.)

Install:
```sh
# back up any existing config first
mv ~/.config/nvim ~/.config/nvim.bak 2>/dev/null

# symlink (or copy) this folder into place
ln -s ~/dotfiles/templates/home/.config/nvim ~/.config/nvim

nvim
```

On first launch, plugins install automatically — just wait for it to finish. Opening a file of a given language (e.g. `.py`, `.go`, `.rs`) auto-installs its LSP server the first time — takes a few seconds, needs internet.

## Shortcuts

**"Space" below means: press and release the Space bar, then press the next key(s).** It's not held down together like Ctrl/Alt.

**"Ctrl+x" or "Alt+x" means: hold Ctrl (or Alt/Option) and press the other key at the same time.**

### Files & search
| Press | What happens |
|---|---|
| Space, then f, then f | find files (type to search, Enter to open) |
| Space, then f, then w | search text across all files (live grep) |
| Space, then f, then b | switch between open files |
| Space, then f, then z | search text in the current file only |
| Space, then f, then h | search help docs |
| Space, then f, then o | recently opened files |

### Sidebar (file explorer)
| Press | What happens |
|---|---|
| (opens automatically on startup) | |
| Ctrl+n | show/hide sidebar |
| Space, then e | jump into sidebar |
| Ctrl+h | move focus into sidebar |
| Ctrl+l | move focus out of sidebar, back to file |
| type `:q` and Enter | closes sidebar + quits nvim in one go, if sidebar is open |

### Tabs (open files)
| Press | What happens |
|---|---|
| Tab | next tab |
| Shift+Tab | previous tab |
| Space, then b | open a new empty tab |
| Space, then x | close current tab |

### Windows / splits
| Press | What happens |
|---|---|
| Space, then s, then v | split screen side-by-side |
| Space, then s, then h | split screen top/bottom |
| Space, then s, then x | close the split you're in |
| Space, then s, then e | make all splits equal size |
| Ctrl+h / j / k / l | move focus left / down / up / right between splits |
| Ctrl+Up / Down / Left / Right | resize the split you're in |

### Editing / selecting text
| Press | What happens |
|---|---|
| `;` | same as typing `:` (open command line) |
| type `jk` while typing text | exits typing mode |
| `v` | start selecting individual characters |
| `V` | start selecting whole lines |
| Ctrl+v | start selecting a rectangular block |
| `gv` | reselect your last selection |
| Ctrl+n / Ctrl+p while typing | move down/up through autocomplete suggestions |
| Ctrl+Space while typing | force-show autocomplete suggestions |

### Git
| Press | What happens |
|---|---|
| Space, then g, then g | open git panel (view changes, stage, commit, push) |
| Space, then g, then t | search git-changed files |

### Terminal
| Press | What happens |
|---|---|
| Space, then t, then t | show/hide a terminal at the bottom |
| Ctrl+x (while inside the terminal) | leave terminal typing mode |

### Formatting / linting
| Press | What happens |
|---|---|
| type `:Format` and Enter | auto-format the current file |
| (automatic) | linter runs by itself when you save or open a file |

### AI assistant (Claude Code)
| Press | What happens |
|---|---|
| Space, then a, then c | show/hide the assistant panel |
| Space, then a, then f | jump into the assistant panel |
| Space, then a, then b | add the current file as context |
| select text, then Space, then a, then s | send selected text to the assistant |
| Space, then a, then r | resume last session |
| Space, then a, then Shift+c | continue previous conversation |
| Space, then a, then a | accept a suggested change |
| Space, then a, then d | reject a suggested change |

### Other
| Press | What happens |
|---|---|
| Space, then t, then p | typing speed test |
| Space, then t, then h | switch between light/dark theme |
