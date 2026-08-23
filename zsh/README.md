# zsh

Current mac shell setup: Oh My Zsh + Powerlevel10k, on top of Homebrew zsh.
This is separate from `templates/home/.zshrc` (the old Manjaro/Ansible
version) — that one stays as-is for history.

- `.zshrc` — Oh My Zsh, Powerlevel10k, zsh-syntax-highlighting /
  zsh-autosuggestions (via brew), plus tool init blocks (conda, nvm, bun,
  gcloud, labctl)
- `.zprofile` — Homebrew shellenv, PATH additions
- `.p10k.zsh` — Powerlevel10k prompt config (`p10k configure` to regenerate)

## Apply on a new machine

```sh
brew install --cask iterm2   # or your terminal of choice
brew install zsh zsh-autosuggestions zsh-syntax-highlighting

sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ~/.powerlevel10k

cp zsh/.zshrc zsh/.zprofile zsh/.p10k.zsh ~/
```

Note: `.zshrc` has tool-specific PATH blocks (conda, nvm, bun, gcloud SDK,
labctl) that assume those tools are installed at their default locations —
install what you actually use and prune the rest.
