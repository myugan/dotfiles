# macOS setup

Current machine: `MacBook Air (2)`, macOS 26.5 (Tahoe), Apple Silicon.

Everything else in this repo (`templates/`, `tasks/`, `main.yml`, Ansible) is the old
Manjaro Linux setup and is unrelated to this directory.

## Replicate on a fresh Mac

```sh
git clone https://github.com/myugan/dotfiles ~/dotfiles
cd ~/dotfiles
./install.sh
```

Runs everything: Xcode CLT check, Homebrew, `brew bundle` (CLI tools, fonts,
apps, VS Code extensions), zsh/Oh My Zsh/Powerlevel10k, git config + GPG
pinentry, nvim, iTerm2 profile, Obsidian vaults, macOS defaults. Existing
files are backed up with a timestamp suffix, never silently overwritten.

Run a subset instead of everything:

```sh
./install.sh zsh nvim        # just these steps
```

Steps, individually documented: [`../zsh/README.md`](../zsh/README.md),
[`../git/README.md`](../git/README.md), [`../nvim/README.md`](../nvim/README.md),
[`../iterm2/README.md`](../iterm2/README.md), [`../obsidian/README.md`](../obsidian/README.md).

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
