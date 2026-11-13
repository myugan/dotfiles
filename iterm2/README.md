# iTerm2

`com.googlecode.iterm2.plist` is the exported preferences (`defaults export
com.googlecode.iterm2`), converted to XML for readable diffs. It holds the
`Default` profile: color scheme, key mappings, window/tab behavior.

Fonts (installed via `../macos/Brewfile`):
- **Normal font**: Space Mono, 12pt (`font-space-mono`)
- **Non-ASCII font**: JetBrainsMonoNFM (JetBrains Mono Nerd Font Mono), 12pt
  (`font-jetbrains-mono-nerd-font`) — powerline/glyph icons for the
  Powerlevel10k prompt

- **Ioskeley Mono** (`IoskeleyMonoTermNFM`, 12pt) — second profile, not on
  Homebrew; TTFs live in [`fonts/`](fonts/). Install with
  `cp fonts/*.ttf ~/Library/Fonts/` (done by `install.sh`).

## Apply on a new machine

```sh
brew install --cask iterm2 font-space-mono font-jetbrains-mono-nerd-font

# quit iTerm2 first, then:
defaults import com.googlecode.iterm2 iterm2/com.googlecode.iterm2.plist
```

Relaunch iTerm2.

## Color preset

Ioskeley Mono profile uses **Rosé Pine** (main) in dark mode. The colors are
already inside `com.googlecode.iterm2.plist` (profile colors plus the
`Custom Color Presets` list), so `./install.sh iterm2` brings them in.

[`colors/`](colors/) holds standalone `.itermcolors` copies (`rose-pine`,
`rose-pine-moon`, `rose-pine-dawn`) as a fallback. To import by hand:
iTerm2 → Settings → Profiles → Colors → Color Presets… → Import…
