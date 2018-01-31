#!/bin/bash

# Colors
RED="\[\033[0;31m\]"
YLW="\[\033[1;33m\]"
GRN="\[\033[0;32m\]"
BLU="\[\033[1;34m\]"
LGT_RED="\[\033[1;31m\]"
LGT_GRN="\[\033[1;32m\]"
LGT_GRY="\[\033[0;37m\]"
WHT="\[\033[1;37m\]"
N="\[\e[0m\]"

# bash completion
if ! shopt -oq posix; then
  if [ -f /usr/share/bash-completion/bash_completion ]; then
    . /usr/share/bash-completion/bash_completion
  elif [ -f /etc/bash_completion ]; then
    . /etc/bash_completion
  fi
fi

# support 256 colors
if [ -e /usr/share/terminfo/x/xterm-256color ]; then
        export TERM='xterm-256color'
else
        export TERM='xterm-color'
fi

# enable color support of ls and also add handy aliases
if [ -x /usr/bin/dircolors ]; then
    test -r ~/.dircolors && eval "$(dircolors -b ~/.dircolors)" || eval "$(dircolors -b)"
    alias ls='ls --color=auto -h'
    alias grep='grep --color=auto'
    alias fgrep='fgrep --color=auto'
    alias egrep='egrep --color=auto'
fi

# Aliases
#. $HOME/.bash_aliases

# Prompt
if [ $UID -eq "0" ] && UC=$RED;
then
	PS1="${RED}\u@\h${N} \W $ "
    #PS1="\u  ${G}\W${N}  "
    #PS1="─────${N} "
    #PS1="${G}─${N}───${G}─${N} "
    #PS1="\W »${N} "
    #PS1="${G}\W ${N}"
else
	PS1="\u@\h \W $ "
	#PS1="[ \w ] $ "
fi

# history length
HISTSIZE=10000
HISTFILESIZE=2000
