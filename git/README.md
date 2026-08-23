# git

- `.gitconfig` → `~/.gitconfig` — user identity, GPG commit signing on
- `ignore` → `~/.config/git/ignore` — global gitignore

GPG signing key is referenced by ID only (`3CA5450F1DDF55A2`); the actual key
is not in this repo — export/import it separately (`gpg --export-secret-keys`)
if setting up a new machine.

```sh
cp git/.gitconfig ~/.gitconfig
mkdir -p ~/.config/git && cp git/ignore ~/.config/git/ignore

# GPG commit signing needs a passphrase prompt; pinentry-curses needs a real
# tty, pinentry-mac pops a native GUI dialog instead (works from anywhere,
# including non-interactive shells/agents)
brew install --cask pinentry-mac   # also in macos/Brewfile
mkdir -p ~/.gnupg
echo "pinentry-program /opt/homebrew/bin/pinentry-mac" >> ~/.gnupg/gpg-agent.conf
gpgconf --kill gpg-agent
```
