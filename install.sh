#!/usr/bin/env bash
# Bootstraps a fresh Mac from this repo's macos/, zsh/, git/, nvim/, iterm2/,
# obsidian/, omp/ directories. Safe to re-run: existing files are backed up with a
# timestamp suffix before being overwritten, never silently clobbered.
#
# Usage: ./install.sh [step ...]
#   No args   -> run every step below, in order.
#   Named args -> run only those steps, e.g. ./install.sh zsh nvim
#   omp_theme  -> not in the default run; omp's look only (see omp/README.md)
#   fonts      -> every font the configs use; iterm2, obsidian and omp_theme run it too
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
  if [ -f "$HOME/.zshrc" ]; then
    # Names only: export lines often hold tokens (MCP servers read some from the environment).
    local lost
    lost="$(grep -E '^[[:space:]]*export ' "$HOME/.zshrc" | grep -Fvx -f "$REPO_ROOT/zsh/.zshrc" \
      | sed -E 's/^[[:space:]]*export[[:space:]]+([A-Za-z_][A-Za-z0-9_]*).*/\1/' | sort -u | tr '\n' ' ')"
    [ -n "$lost" ] && warn "your old ~/.zshrc exports these and the new one does not: ${lost}— copy what you need from ~/.zshrc.bak-${TS}"
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

iterm2_running() {
  ps -axo comm= | grep -q '/iTerm.app/Contents/MacOS/iTerm2$'
}

# Fonts the configs name: iTerm2 profiles (Ioskeley Mono, Space Mono, JetBrains Mono NF),
# Obsidian (Commissioner, Space Grotesk, Ioskeley Mono), omp's nerd symbols (Ioskeley Mono).
FONT_CASKS=(font-jetbrains-mono-nerd-font font-space-mono font-space-grotesk font-commissioner)
FONTS_DONE=0

step_fonts() {
  [ "$FONTS_DONE" = 1 ] && return
  FONTS_DONE=1
  log "fonts (Ioskeley Mono from iterm2/fonts, the rest from Homebrew)"
  mkdir -p "$HOME/Library/Fonts"
  cp "$REPO_ROOT"/iterm2/fonts/*.ttf "$HOME/Library/Fonts/"
  if ! command -v brew >/dev/null 2>&1; then
    warn "Homebrew not installed — skipping ${FONT_CASKS[*]} (run ./install.sh homebrew fonts)"
    return
  fi
  local cask
  for cask in "${FONT_CASKS[@]}"; do
    brew list --cask "$cask" >/dev/null 2>&1 && continue
    brew install --cask "$cask" || warn "$cask failed (a manually installed copy in ~/Library/Fonts blocks it; that copy works too)"
  done
}

step_iterm2() {
  log "iTerm2 (Ioskeley Mono profile, Rosé Pine colors)"
  if ! command -v defaults >/dev/null 2>&1; then
    warn "no 'defaults' command (not macOS?) — skipping"
    return
  fi
  step_fonts
  # Quitting iTerm2 from inside iTerm2 kills this script before the import runs,
  # and a still-running iTerm2 writes its old prefs back on exit, undoing the import.
  if [ -n "${ITERM_SESSION_ID:-}" ] || [ "${TERM_PROGRAM:-}" = "iTerm.app" ]; then
    warn "running inside iTerm2 — skipping. Open Terminal.app and run: $REPO_ROOT/install.sh iterm2"
    return
  fi
  if iterm2_running; then
    osascript -e 'tell application "iTerm2" to quit' >/dev/null 2>&1 || true
    local i
    for i in $(seq 30); do
      iterm2_running || break
      sleep 1
    done
    if iterm2_running; then
      warn "iTerm2 is still running (answer its quit prompt, or quit it), then re-run: ./install.sh iterm2"
      return
    fi
  fi
  defaults import com.googlecode.iterm2 "$REPO_ROOT/iterm2/com.googlecode.iterm2.plist"
  killall cfprefsd >/dev/null 2>&1 || true
  # verify the import stuck: profile + Rosé Pine preset must be in the live prefs
  local live
  live="$(defaults export com.googlecode.iterm2 - 2>/dev/null)"
  if grep -q '<string>Ioskeley Mono</string>' <<<"$live" && grep -q '<key>rose-pine</key>' <<<"$live"; then
    echo "profile + Rosé Pine preset imported — launch iTerm2"
  else
    warn "import did not stick (Ioskeley Mono profile or rose-pine preset missing) — import iterm2/colors/rose-pine.itermcolors by hand"
  fi
}

step_obsidian() {
  log "Obsidian"
  step_fonts
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

# omp settings that decide which MCP servers load; step_omp carries them over when
# it replaces config.yml (browser.enabled=true drops browser MCP servers).
omp_mcp_settings() {
  omp config list --scope global --json 2>/dev/null | jq -r 'to_entries[]
    | select(.key | test("^mcp\\.|^browser\\.enabled$"))
    | "\(.key)\t\(.value.value | if type == "string" then . else tojson end)"'
}

step_omp() {
  log "omp (config, models, theme, emphasis extension, skills)"
  # File by file: ~/.omp/agent also holds sessions, auth, databases and mcp.json, and
  # extensions/ holds files other tools manage (atuin.ts, corgi.js).
  local src="$REPO_ROOT/omp/agent" f keep="" keep_config=0
  if [ -f "$HOME/.omp/agent/config.yml" ]; then
    if command -v omp >/dev/null 2>&1 && command -v jq >/dev/null 2>&1; then
      keep="$(omp_mcp_settings)"
    else
      keep_config=1
      warn "omp or jq missing — can't carry MCP settings over, so keeping your existing config.yml"
    fi
  fi
  while IFS= read -r f; do
    [ "$f" = config.yml ] && [ "$keep_config" = 1 ] && continue
    backup_and_copy "$src/$f" "$HOME/.omp/agent/$f"
  done < <(cd "$src" && find . -type f | sed 's|^\./||')
  local k v
  while IFS=$'\t' read -r k v; do
    [ -n "$k" ] && omp config set "$k" "$v" >/dev/null && echo "kept $k = $v"
  done <<<"$keep"
  if command -v atuin >/dev/null 2>&1; then
    atuin hook install omp   # writes ~/.omp/agent/extensions/atuin.ts
  else
    warn "atuin not installed — skipping its omp hook (brew bundle installs it)"
  fi
  warn "models.yml reads LEBREL_API_KEY from the environment — export it before starting omp"
}

step_omp_theme() {
  log "omp look only (themes, emphasis pills, theme + status line settings)"
  # Leaves the model, memory and secrets settings, models.yml, skills and MCP servers alone.
  if ! command -v omp >/dev/null 2>&1; then
    warn "omp not installed — run: brew install can1357/tap/omp"
    return
  fi
  local src="$REPO_ROOT/omp/agent" f
  for f in "$src"/themes/*.json "$src"/extensions/emphasis.ts "$src"/emphasis.LICENSE; do
    backup_and_copy "$f" "$HOME/.omp/agent/${f#"$src"/}"
  done
  # Same values as omp/agent/config.yml; keep the two in sync.
  omp config set theme.dark terminal
  omp config set theme.light terminal
  omp config set symbolPreset nerd
  omp config set composer.shape claude
  omp config set statusLine.preset custom
  omp config set statusLine.leftSegments '["pi","vim","model","mode","path","git","pr"]'
  omp config set statusLine.rightSegments '["session_name","token_in","token_out","cost","context_pct"]'
  omp config set statusLine.sessionAccent false
  omp config set extensionRenderers.assistantText true   # emphasis.ts draws pills only with this on
  step_fonts   # symbolPreset nerd needs a Nerd Font in the terminal
  warn "omp's 'terminal' theme takes its colors from the terminal: for Rosé Pine + Ioskeley Mono, open Terminal.app and run ./install.sh iterm2"
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

ALL_STEPS=(xcode_clt homebrew brewfile fonts zsh git nvim iterm2 obsidian omp macos_defaults)

# Every MCP config omp reads (its own plus the other tools it imports from), and omp's
# MCP settings. No step writes them; the run ends by proving that.
MCP_FILES=(.omp/agent/mcp.json .omp/agent/.mcp.json .claude.json .claude/mcp.json
  .codex/config.toml .gemini/settings.json .config/opencode/opencode.json
  .config/opencode/opencode.jsonc .cursor/mcp.json .codeium/windsurf/mcp_config.json)

mcp_snapshot() {
  local f
  for f in "${MCP_FILES[@]/#/$HOME/}" "$HOME"/.omp/profiles/*/agent/mcp.json; do
    [ -f "$f" ] && echo "$(shasum "$f" | cut -d' ' -f1) ${f#"$HOME"/}"
  done
  if command -v omp >/dev/null 2>&1 && command -v jq >/dev/null 2>&1; then
    omp_mcp_settings
  fi
}

steps=("$@")
[ ${#steps[@]} -eq 0 ] && steps=("${ALL_STEPS[@]}")

mcp_before="$(mcp_snapshot)"
for s in "${steps[@]}"; do
  "step_${s}"
done

mcp_after="$(mcp_snapshot)"
if [ "$mcp_before" = "$mcp_after" ]; then
  log "MCP config unchanged ($(grep -c . <<<"$mcp_before") files/settings checked)"
else
  warn "MCP config changed during this run:"
  diff <(echo "$mcp_before") <(echo "$mcp_after") >&2
fi

log "done"
