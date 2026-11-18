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

- `../zsh/.zshrc` — the `omp()` wrapper that runs omp inside the nono sandbox, Atuin and fzf init, and `PI_EMPHASIS_PILL_ICONS=0` / `PI_EMPHASIS_ROUND_CAPS=0` (square pills without Nerd Font icons; drop them to get icons and rounded ends)
- `../nono/omp-local.json` — the sandbox profile: read-write on the project, `~/.omp`, `~/.npm` and `~/.atuin` (so Atuin can record from inside the sandbox)

## Apply on a new machine

```sh
brew bundle --file=macos/Brewfile   # omp, nono, atuin, fzf
./install.sh omp nono zsh
export LEBREL_API_KEY=...           # only if you use the Lebrel models
```

Then start `omp` from a project directory (the wrapper refuses to sandbox `$HOME`).
