# Obsidian

Two vaults live in iCloud Drive (`~/Library/Mobile Documents/iCloud~md~obsidian/Documents/`):
`Personal` and `Professional`. Only the `.obsidian` config folder from each is
kept here — **not the notes themselves** (private).

Also stripped, on purpose:
- `workspace.json` / `workspace-mobile.json` — local UI state (open panes,
  last file), regenerates itself, just causes noisy diffs.
- Plugin `main.js` / `styles.css` / `manifest.json` — the plugin code itself.
  Obsidian re-downloads these when you enable a community plugin, so keeping
  them here would just be dead weight that goes stale. Only `data.json` (your
  actual settings for that plugin) is kept.
- The `Minimal` theme under `Professional/.obsidian/themes/` — it's a
  published community theme (installed via Settings → Appearance), not
  something worth vendoring. `myugan-blog` is the custom one and is kept.

## ⚠️ Secret stripped

`Professional/.obsidian/plugins/copilot/data.json` had a **live Anthropic API
key** in plaintext (`anthropicApiKey`). It's been blanked out before
committing. Re-enter it manually in Obsidian → Copilot settings after
restoring — never commit it back.

## Apply on a new machine

```sh
brew install --cask obsidian

VAULT_DIR=~/Library/Mobile\ Documents/iCloud~md~obsidian/Documents

cp -R obsidian/Personal/.obsidian     "$VAULT_DIR/Personal/.obsidian"
cp -R obsidian/Professional/.obsidian "$VAULT_DIR/Professional/.obsidian"
```

Then open each vault in Obsidian, go to Settings → Community plugins, and
install/enable whichever plugins you want back. `community-plugins.json`
tracks what's currently *enabled* — Personal has `obsidian-importer` enabled;
Professional's list is empty (plugins below are installed but currently
switched off), though settings are preserved under `plugins/*/data.json` for
when you re-enable: Copilot, Editing Toolbar, Linter, Omnisearch, Recent
Files, Snippets Manager, Templater. Obsidian fetches the plugin code itself —
your saved settings will already be there once you enable it.
