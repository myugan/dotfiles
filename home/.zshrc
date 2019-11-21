#
#        ▌     
#    ▀▌▛▘▛▌▛▘▛▘
#  ▗ ▙▖▄▌▌▌▌ ▙▖
#
#

limit -s coredumpsize 0

export ZSH="/home/debian/.oh-my-zsh"
export HISTIGNORE="pwd:ls:cd"
export EDITOR="vim"

ZSH_THEME="agnoster"

# Plugins
. $ZSH/oh-my-zsh.sh
. $HOME/.zsh/zsh-autosuggestions/zsh-autosuggestions.zsh
. $HOME/.zsh/functions.zsh
. $HOME/.oh-my-zsh/custom/plugins/warhol/warhol.plugin.zsh

plugins=(git)

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

alias ls="lsd"
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

# Created by `userpath` on 2019-11-18 01:36:04
export PATH="$PATH:/home/debian/.local/bin"
