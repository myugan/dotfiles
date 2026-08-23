#!/usr/bin/env bash
# Bootstraps a fresh Mac from this repo's macos/, zsh/, git/, nvim/, iterm2/,
# obsidian/ directories. Safe to re-run: existing files are backed up with a
# timestamp suffix before being overwritten, never silently clobbered.
#
# Usage: ./install.sh [step ...]
#   No args   -> run every step below, in order.
#   Named args -> run only those steps, e.g. ./install.sh zsh nvim
set -uo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TS="$(date +%Y%m%d-%H%M%S)"

log()  { printf '\n\033[1;34m==>\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33mwarn:\033[0m %s\n' "$*" >&2; }

backup_and_copy() {
  # backup_and_copy <src> <dst>
  local src="$1" dst="$2"
  if [ -e "$dst" ] || [ -L "$dst" ]; then
    mv "$dst" "${dst}.bak-${TS}"
    warn "backed up existing $dst -> ${dst}.bak-${TS}"
  fi
  mkdir -p "$(dirname "$dst")"
  cp -R "$src" "$dst"
}

step_xcode_clt() {
  log "Xcode Command Line Tools"
  if xcode-select -p >/dev/null 2>&1; then
    echo "already installed"
  else
    xcode-select --install
    echo "installer launched — finish it, then re-run this script"
    exit 1
  fi
}

step_homebrew() {
  log "Homebrew"
  if command -v brew >/dev/null 2>&1; then
    echo "already installed"
  else
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    eval "$(/opt/homebrew/bin/brew shellenv)"
  fi
}

step_brewfile() {
  log "brew bundle (CLI tools, fonts, apps, VS Code extensions)"
  brew bundle --file="$REPO_ROOT/macos/Brewfile"
}

step_zsh() {
  log "zsh (Oh My Zsh + Powerlevel10k)"
  if [ ! -d "$HOME/.oh-my-zsh" ]; then
    sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended
  fi
  if [ ! -d "$HOME/.powerlevel10k" ]; then
    git clone --depth=1 https://github.com/romkatv/powerlevel10k.git "$HOME/.powerlevel10k"
  fi
  backup_and_copy "$REPO_ROOT/zsh/.zshrc"    "$HOME/.zshrc"
  backup_and_copy "$REPO_ROOT/zsh/.zprofile" "$HOME/.zprofile"
  backup_and_copy "$REPO_ROOT/zsh/.p10k.zsh" "$HOME/.p10k.zsh"
}

step_git() {
  log "git config"
  backup_and_copy "$REPO_ROOT/git/.gitconfig" "$HOME/.gitconfig"
  backup_and_copy "$REPO_ROOT/git/ignore"      "$HOME/.config/git/ignore"

  local agent_conf="$HOME/.gnupg/gpg-agent.conf"
  mkdir -p "$HOME/.gnupg"
  if ! grep -q pinentry-mac "$agent_conf" 2>/dev/null; then
    echo "pinentry-program /opt/homebrew/bin/pinentry-mac" >> "$agent_conf"
    gpgconf --kill gpg-agent 2>/dev/null || true
  fi
  warn "GPG signing key itself is not in this repo — import your secret key separately (gpg --import), then update .gitconfig's signingkey if it changed"
}

step_nvim() {
  log "nvim (NvChad-based)"
  backup_and_copy "$REPO_ROOT/nvim" "$HOME/.config/nvim"
  echo "plugins + LSPs auto-install on first nvim launch"
}

step_iterm2() {
  log "iTerm2"
  if ! command -v defaults >/dev/null 2>&1; then
    warn "no 'defaults' command (not macOS?) — skipping"
    return
  fi
  osascript -e 'tell application "iTerm2" to quit' >/dev/null 2>&1 || true
  defaults import com.googlecode.iterm2 "$REPO_ROOT/iterm2/com.googlecode.iterm2.plist"
  echo "profile imported — relaunch iTerm2"
}

step_obsidian() {
  log "Obsidian"
  local vault_dir="$HOME/Library/Mobile Documents/iCloud~md~obsidian/Documents"
  if [ ! -d "$vault_dir" ]; then
    warn "$vault_dir not found (Obsidian/iCloud not set up yet) — skipping"
    return
  fi
  for vault in Personal Professional; do
    if [ -d "$vault_dir/$vault" ]; then
      backup_and_copy "$REPO_ROOT/obsidian/$vault/.obsidian" "$vault_dir/$vault/.obsidian"
    else
      warn "vault '$vault' not found under $vault_dir — skipping"
    fi
  done
  warn "re-enable community plugins in Obsidian settings, and re-enter the Copilot API key (stripped from data.json before committing)"
}

step_macos_defaults() {
  log "macOS defaults"
  defaults write com.apple.dock tilesize -int 35
  defaults write com.apple.AppleMultitouchTrackpad Clicking -bool false
  defaults write com.apple.AppleMultitouchTrackpad TrackpadThreeFingerDrag -bool false
  defaults write com.apple.dock wvous-br-corner -int 14
  defaults write com.apple.dock wvous-br-modifier -int 0
  killall Dock >/dev/null 2>&1 || true
}

ALL_STEPS=(xcode_clt homebrew brewfile zsh git nvim iterm2 obsidian macos_defaults)

steps=("$@")
[ ${#steps[@]} -eq 0 ] && steps=("${ALL_STEPS[@]}")

for s in "${steps[@]}"; do
  "step_${s}"
done

log "done"
