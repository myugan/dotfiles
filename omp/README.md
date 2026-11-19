# omp

Config for [omp](https://omp.sh) (oh-my-pi), the terminal coding agent. Everything here mirrors `~/.omp/agent/`.

- `agent/config.yml` — default model, theme, status line, memory, secrets, and `extensionRenderers.assistantText: true` (required for the emphasis pills below)
- `agent/models.yml` — custom provider (Lebrel). The key is read from the `LEBREL_API_KEY` environment variable; no secret is stored here
- `agent/themes/` — `terminal` (active), `light-gray`, `titanium-gray`
- `agent/extensions/emphasis.ts` — omp port of [pi-emphasis](https://github.com/johnlindquist/pi-emphasis) (MIT, `agent/emphasis.LICENSE`): draws `[[Done]]`-style status pills in colour and adds the reply-style rules to the prompt. Uses omp's `registerAssistantTextRenderer`, and falls back to reverse video for the yellow pills because omp themes have no `searchMatchBg`
- `agent/skills/` — `git-commit`, `convert-documents-to-markdown`

Not stored here, because a tool generates them:

- `extensions/atuin.ts` — `atuin hook install omp`; records every bash command omp runs, tagged with author `omp` (`atuin search --author omp -- ''`)
- `extensions/corgi.js` — `corgi integration install omp`
- sessions, auth, memories and the `*.db` files

## Related

- `../zsh/.zshrc` — Atuin and fzf init, and `PI_EMPHASIS_PILL_ICONS=0` / `PI_EMPHASIS_ROUND_CAPS=0` (square pills without Nerd Font icons; drop them to get icons and rounded ends)

## Apply on a new machine

Everything (config, models, themes, extension, skills, atuin hook):

```sh
brew bundle --file=macos/Brewfile   # omp, atuin, fzf
./install.sh omp zsh
export LEBREL_API_KEY=...           # only if you use the Lebrel models
```

This overwrites `~/.omp/agent/config.yml` (default model, memory, secrets) and `models.yml`; the old files are kept as `*.bak-<timestamp>`. Your MCP setup stays: `mcp.json` is never written, and the settings that decide which MCP servers load (`mcp.*`, `browser.enabled`) are read from the old `config.yml` and set again on the new one (needs `jq`, built into macOS 15+; without it the old `config.yml` is kept).

### Look only

Themes, emphasis pills, status line and Nerd Font, on top of an existing omp setup:

```sh
brew install can1357/tap/omp       # skip if already installed
./install.sh omp_theme
```

Then, for the Rosé Pine colors, quit iTerm2 and run this from **Terminal.app** (the step refuses to run inside iTerm2, because quitting iTerm2 would kill it mid-import):

```sh
./install.sh iterm2
```

The active omp theme, `terminal`, has no colors of its own: it uses the terminal's ANSI palette, so omp looks Rosé Pine only when the iTerm2 profile does. `./install.sh iterm2` imports the **Ioskeley Mono** profile with Rosé Pine (light and dark mode) and makes it the default profile. If iTerm2 still opens with the `Default` profile and no `rose-pine` preset, the import did not run; re-run it from Terminal.app with iTerm2 quit.

`omp_theme` copies `agent/themes/*.json`, `agent/extensions/emphasis.ts` and `agent/emphasis.LICENSE`, then sets only the look keys with `omp config set`: `theme`, `symbolPreset`, `composer.shape`, `statusLine`, `extensionRenderers.assistantText`. Your model, memory and secrets settings, `models.yml`, skills and MCP servers stay as they are. It also runs `./install.sh fonts`, so the Nerd Font that `symbolPreset: nerd` and the pill icons need is installed.

Pills are rounded with icons by default. For the square, icon-free pills from `../zsh/.zshrc`, add to your shell rc:

```sh
export PI_EMPHASIS_PILL_ICONS=0
export PI_EMPHASIS_ROUND_CAPS=0
```

Restart omp afterwards.
