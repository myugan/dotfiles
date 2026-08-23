# macOS setup

Current machine: `MacBook Air (2)`, macOS 26.5 (Tahoe), Apple Silicon.

Everything else in this repo (`templates/`, `tasks/`, `main.yml`, Ansible) is the old
Manjaro Linux setup and is unrelated to this directory.

## Replicate on a fresh Mac

```sh
# 1. Xcode Command Line Tools (git, etc.)
xcode-select --install

# 2. Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 3. Everything in one shot: CLI tools, fonts, GUI apps, VS Code extensions
git clone https://github.com/myugan/dotfiles ~/dotfiles
cd ~/dotfiles
brew bundle --file=macos/Brewfile

# 4. Shell (see ../zsh/README.md)
# 5. Git (see ../git/)
# 6. Neovim (see ../nvim/)
# 7. iTerm2 (see ../iterm2/README.md)
# 8. Obsidian (see ../obsidian/README.md)
```

`Brewfile` is generated with `brew bundle dump` and includes:
- CLI formulae (`ripgrep`, `tmux`, `helm`, `kubectl`, `terraform`, `go`, `neovim`, ...)
- Fonts: JetBrains Mono Nerd Font (terminal icons/powerline), Space Mono (terminal
  body font), Space Grotesk (Obsidian UI font)
- GUI apps installed on this machine (browsers, Office, Docker, VPN clients, etc.)
- VS Code / Cursor extensions

Not in the Brewfile (Mac App Store / Apple-signed only, install manually):
Keynote, Numbers, Pages, iMovie, GarageBand, Windows App, Bear, FileZilla.

Refresh the Brewfile after installing/removing something:

```sh
brew bundle dump --file=macos/Brewfile --force
```

## System defaults worth knowing

Most of macOS is left at stock settings on this machine. The handful that are
customized:

| Setting | Value |
|---|---|
| Dock tile size | `35` |
| Trackpad "Tap to click" | off |
| Trackpad three-finger drag | off |
| Bottom-right hot corner | Quick Note |

```sh
# apply the above
defaults write com.apple.dock tilesize -int 35
defaults write com.apple.AppleMultitouchTrackpad Clicking -bool false
defaults write com.apple.AppleMultitouchTrackpad TrackpadThreeFingerDrag -bool false
defaults write com.apple.dock wvous-br-corner -int 14
defaults write com.apple.dock wvous-br-modifier -int 0
killall Dock
```

Everything else (Finder, keyboard repeat rate, appearance/dark mode, natural
scroll direction, menu bar items) is untouched system default — not worth
scripting since a factory Mac already matches.
