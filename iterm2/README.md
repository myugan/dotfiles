# iTerm2

`com.googlecode.iterm2.plist` is the exported preferences (`defaults export com.googlecode.iterm2`), converted to XML for readable diffs. It holds the `Default` profile: color scheme, key mappings, window/tab behavior.

Fonts (all installed by `./install.sh fonts`, which `./install.sh iterm2` runs first):
- **Normal font**: Space Mono, 12pt (`font-space-mono`)
- **Non-ASCII font**: JetBrainsMonoNFM (JetBrains Mono Nerd Font Mono), 12pt (`font-jetbrains-mono-nerd-font`) — powerline/glyph icons for the Powerlevel10k prompt

- **Ioskeley Mono** (`IoskeleyMonoTermNFM`, 12pt) — default profile, not on Homebrew; TTFs live in [`fonts/`](fonts/) and are copied to `~/Library/Fonts/`.

## Apply on a new machine

Quit iTerm2, then from **Terminal.app**:

```sh
brew install --cask iterm2
./install.sh iterm2
```

Launch iTerm2: it opens with the **Ioskeley Mono** profile (the default) in Rosé Pine.

The step skips itself when run inside iTerm2: quitting iTerm2 would kill the script before `defaults import` runs, and a running iTerm2 writes its old preferences back on exit. It also waits for iTerm2 to fully exit before importing.

## Color preset

Ioskeley Mono profile uses **Rosé Pine** (main) in dark mode. The colors are already inside `com.googlecode.iterm2.plist` (profile colors plus the `Custom Color Presets` list), so `./install.sh iterm2` brings them in.

[`colors/`](colors/) holds standalone `.itermcolors` copies (`rose-pine`, `rose-pine-moon`, `rose-pine-dawn`) as a fallback. To import by hand: iTerm2 → Settings → Profiles → Colors → Color Presets… → Import…
