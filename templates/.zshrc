#
#        ▌     
#    ▀▌▛▘▛▌▛▘▛▘
#  ▗ ▙▖▄▌▌▌▌ ▙▖
#
#

limit -s coredumpsize 0

export ZSH="$HOME/.oh-my-zsh"
export HISTIGNORE="pwd:ls:cd"
export EDITOR="vim"

#ZSH_THEME="agnoster"
OS_ICON='\uF312'
ZSH_AUTOSUGGEST_HIGHLIGHT_STYLE="fg=#ff00ff,bg=cyan,bold,underline"
POWERLEVEL9K_LEFT_PROMPT_ELEMENTS=(os_icon dir vcs)
POWERLEVEL9K_DISABLE_RPROMPT=true

# Plugins
. $ZSH/oh-my-zsh.sh
. $HOME/.zsh/zsh-autosuggestions/zsh-autosuggestions.zsh
. $HOME/.zsh/functions.zsh
. $HOME/.oh-my-zsh/custom/plugins/warhol/warhol.plugin.zsh
. /usr/share/zsh-theme-powerlevel9k/powerlevel9k.zsh-theme
. $HOME/.zgen/zgen.zsh

plugins=(git warhol kubetail kubectl)

# History
HISTFILE=~/.histfile
HISTSIZE=10000
SAVEHIST=10000
setopt append_history           # append
setopt hist_ignore_all_dups     # no duplicate

# Key bindings
bindkey -e
bindkey '^A' 		beginning-of-line		# Home
bindkey '^E' 		end-of-line			# End
bindkey '\eOc'	 	forward-word			# C-Right
bindkey '\eOd' 	backward-word			# C-Left
bindkey '\e[2~'	overwrite-mode 		# Insert

# Title
#print -Pn "\e]0;%n@%m: %~\a"

# Completion
eval $(dircolors)
autoload -Uz compinit && compinit
autoload -U colors && colors

setopt auto_cd                  # if command is a path, cd into it
setopt completealiases          # complete alisases
setopt correct                  # spelling correction for commands
setopt auto_pushd               # make cd push old dir in dir stack
setopt pushd_ignore_dups        # no duplicates in dir stack
setopt pushd_silent             # no dir stack after pushd or popd
setopt pushd_to_home            # `pushd` = `pushd $HOM

zstyle ':completion::complete:*' use-cache on			# completion caching, use rehash to clear
zstyle ':completion:*' matcher-list 'm:{a-zA-Z}={A-Za-z}'   # ignore case
zstyle ':completion:*' list-colors ${(s.:.)LS_COLORS}		# color

compdef _gnu_generic gcc
compdef _gnu_generic gdb

# Prompt
#if [[ $EUID -ne 0 ]]; then
    #PROMPT='%B%F{blue}%n@%m %F{magenta}%d%f%b » '
    #PROMPT='➜ '
    #PROMPT='%B%F{blue}%n@%m %F{green} %~ %f%b '
    #PROMPT='%~ » '
#else
    #PROMPT='%B%F{red}%n@%m %F{white}%d%f%b » '
    #PROMPT='%F{red}%~%f%b » '
#fi
RPROMPT='%D{%H:%M %p}'

if type nvim > /dev/null 2>&1; then
  alias vim='nvim'
fi