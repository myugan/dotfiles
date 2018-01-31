#                   .__
#    ________  _____|  |_________   ____
#    \___   / /  ___/  |  \_  __ \_/ ___\
#     /    /  \___ \|   Y  \  | \/\  \___
# /\ /_____ \/____  >___|  /__|    \___  >
# \/       \/     \/     \/            \/  
#

#------------------------------
# Variables
#------------------------------
export EDITOR="vim"
export ZSH=$HOME/.oh-my-zsh

#-----------------------------
# Plugins
#-----------------------------
. $HOME/.zsh/zsh-autosuggestions/zsh-autosuggestions.zsh
. $HOME/.zsh/functions.zsh
. $ZSH/oh-my-zsh.sh

parse_git_dirty () {
  [[ $(git status 2> /dev/null | tail -n1) != "nothing to commit (working directory clean)" ]] && echo "*"
}
parse_git_branch () {
  git branch --no-color 2> /dev/null | sed -e '/^[^*]/d' -e "s/* \(.*\)/\1$(parse_git_dirty)/"
}

# Ignore stuff starting with a space
setopt histignorespace

# Autocorrection
setopt correct

#-----------------------------
# History
#-----------------------------
HISTFILE=~/.histfile
HISTSIZE=10000
SAVEHIST=10000

# Save history immediately
setopt incappendhistory
# Share history accross terms
setopt sharehistory
# Append history instead of overwriting
setopt appendhistory

#-----------------------------
# Colors
#-----------------------------
[[ -r $XDG_CONFIG_HOME/LS_COLORS/LS_COLORS ]] && {
    eval $(dircolors -b $XDG_CONFIG_HOME/LS_COLORS/LS_COLORS)
}

if [[ $COLORTERM = gnome-* && $TERM = xterm ]]  && infocmp gnome-256color >/dev/null 2>&1; then export TERM=gnome-256color
elif infocmp xterm-256color >/dev/null 2>&1; then export TERM=xterm-256color
fi

if tput setaf 1 &> /dev/null; then
    tput sgr0
    if [[ $(tput colors) -ge 256 ]] 2>/dev/null; then
      MAGENTA=$(tput setaf 9)
      ORANGE=$(tput setaf 172)
      GREEN=$(tput setaf 190)
      PURPLE=$(tput setaf 141)
      WHITE=$(tput setaf 256)
    else
      MAGENTA=$(tput setaf 5)
      ORANGE=$(tput setaf 4)
      GREEN=$(tput setaf 2)
      PURPLE=$(tput setaf 1)
      WHITE=$(tput setaf 7)
    fi
    RESET=$(tput sgr0)
else
    MAGENTA="\033[1;31m"
    ORANGE="\033[1;33m"
    GREEN="\033[1;32m"
    PURPLE="\033[1;35m"
    WHITE="\033[1;37m"
    RESET="\033[m"
fi

#------------------------------
# Aliases
#------------------------------
alias ls="ls --color"
alias ll="ls --color -lh"
alias vi="vim"
#alias ls="colorls -dl"

#------------------------------
# Keybindings
#------------------------------
bindkey -v
zmodload zsh/terminfo
bindkey -s '^l' 'ls\n' 
bindkey -s '^x' 'clear\n'
bindkey '^R' history-incremental-search-backward
bindkey '^[z' undo          # alt-z
bindkey '^[y' redo          # alt-y

# URxvt
bindkey "e[8~" end-of-line
bindkey "e[7~" beginning-of-line
case $TERM in
    rxvt-unicode-256color)
        bindkey '^[Oc' forward-word  # ctrl-right
        bindkey '^[Od' backward-word # ctrl-left
        ;;
    xterm|xterm-256color|screen-256color)
        bindkey '^[[1;5C' forward-word  # ctrl-right
        bindkey '^[[1;5D' backward-word # ctrl-left
        ;;
    linux)
        bindkey '^[[C' forward-word  # ctrl-right
        bindkey '^[[D' backward-word # ctrl-left
        ;;
esac

case $TERM in
    xterm*)
        precmd () {print -Pn "\e]0;%n@%m: %~\a"}
        ;;
esac

[[ -n "${terminfo[khome]}" ]] && bindkey "${terminfo[khome]}" beginning-of-line # Home
[[ -n "${terminfo[kend]}"  ]] && bindkey "${terminfo[kend]}"  end-of-line          # End
[[ -n "${terminfo[kich1]}" ]] && bindkey "${terminfo[kich1]}" overwrite-mode       # Insert
[[ -n "${terminfo[kdch1]}" ]] && bindkey "${terminfo[kdch1]}" delete-char          # Delete
[[ -n "${terminfo[kcuu1]}" ]] && bindkey "${terminfo[kcuu1]}" up-line-or-history   # Up
[[ -n "${terminfo[kcud1]}" ]] && bindkey "${terminfo[kcud1]}" down-line-or-history # Down
[[ -n "${terminfo[kcub1]}" ]] && bindkey "${terminfo[kcub1]}" backward-char        # Left
[[ -n "${terminfo[kcuf1]}" ]] && bindkey "${terminfo[kcuf1]}" forward-char         # Right
[[ -n "${terminfo[kpp]}"   ]] && bindkey "${terminfo[kpp]}"   beginning-of-buffer-or-history # PageUp
[[ -n "${terminfo[knp]}" ]] && bindkey "${terminfo[knp]}" end-of-buffer-or-history # PageDown

#------------------------------
# Comp
#------------------------------
autoload -U +X compinit && compinit
autoload -U colors && colors
autoload -Uz vcs_info
zstyle ':vcs_info:*' formats '%F{2}%s%F{7}:%F{2}(%F{1}%b%F{2})%f '
zstyle ':vcs_info:*' enable git
zstyle :compinstall filename '${HOME}/.zshrc'
zstyle ':completion::complete:*' use-cache on
zstyle ':completion:*:default' list-colors ${(s.:.)LS_COLORS}

#------------------------------
# Prompt
#------------------------------
if [[ $EUID -ne 0 ]]; then
    #PROMPT='%B%F{magenta}%n@%m:%F{yellow}%~%f%b '
    #PROMPT='%B%F{blue}%n@%m %F{magenta}%d%f%b » '
    #PROMPT='%F{blue}%~%f ➜ '
    PROMPT='%B%F{blue}%n@%m %F{white}[%F{magenta} %~%f ]%f%b ' 
else
    PROMPT='%B%F{red}%n@%m %F{white}%d%f%b » '
    #PROMPT='%B%F{red}%n@%m:%F{yellow}%~%f%b '
    #PROMPT='%B%F{red}%n %F{yellow}%~%f%b '
fi
#RPROMPT='%F{white}[%D{%H:%M:%S %p}]'

# Set name of the theme to load. Optionally, if you set this to "random"
#ZSH_THEME="af-magic"
#ZSH_THEME="jispwoso"

plugins=( git bundler ruby zsh-completions )

# You may need to manually set your language environment
export LANG=en_US.UTF-8

DISABLE_AUTO_UPDATE="false"

