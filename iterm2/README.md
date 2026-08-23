# iTerm2

`com.googlecode.iterm2.plist` is the exported preferences (`defaults export
com.googlecode.iterm2`), converted to XML for readable diffs. It holds the
`Default` profile: color scheme, key mappings, window/tab behavior.

Fonts (installed via `../macos/Brewfile`):
- **Normal font**: Space Mono, 12pt (`font-space-mono`)
- **Non-ASCII font**: JetBrainsMonoNFM (JetBrains Mono Nerd Font Mono), 12pt
  (`font-jetbrains-mono-nerd-font`) — powerline/glyph icons for the
  Powerlevel10k prompt

## Apply on a new machine

```sh
brew install --cask iterm2 font-space-mono font-jetbrains-mono-nerd-font

# quit iTerm2 first, then:
defaults import com.googlecode.iterm2 iterm2/com.googlecode.iterm2.plist
```

Relaunch iTerm2.
