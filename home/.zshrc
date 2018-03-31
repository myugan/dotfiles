#
#        ▌     
#    ▀▌▛▘▛▌▛▘▛▘
#  ▗ ▙▖▄▌▌▌▌ ▙▖
#
#

limit -s coredumpsize 0

export EDITOR="vim"

# Plugins
. $HOME/.zsh/zsh-autosuggestions/zsh-autosuggestions.zsh
. $HOME/.zsh/functions.zsh

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
print -Pn "\e]0;%n@%m: %~\a"

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
if [[ $EUID -ne 0 ]]; then
    #PROMPT='%B%F{blue}%n@%m %F{magenta}%d%f%b » '
    PROMPT='➜ '
    #PROMPT='%B%F{blue}%n@%m %F{green} %~ %f%b '
else
    PROMPT='%B%F{red}%n@%m %F{white}%d%f%b » '
fi
RPROMPT='%D{%H:%M %p}'

. ~/.zsh-aliases
# Add RVM to PATH for scripting. Make sure this is the last PATH variable change.
export PATH="$PATH:$HOME/.rvm/bin"

[[ -s "$HOME/.rvm/scripts/rvm" ]] && source "$HOME/.rvm/scripts/rvm"

PATH="/home/blackcat/.perl5/bin${PATH:+:${PATH}}"; export PATH;
PERL5LIB="/home/blackcat/.perl5/lib/perl5${PERL5LIB:+:${PERL5LIB}}"; export PERL5LIB;
PERL_LOCAL_LIB_ROOT="/home/blackcat/.perl5${PERL_LOCAL_LIB_ROOT:+:${PERL_LOCAL_LIB_ROOT}}"; export PERL_LOCAL_LIB_ROOT;
PERL_MB_OPT="--install_base \"/home/blackcat/.perl5\""; export PERL_MB_OPT;
PERL_MM_OPT="INSTALL_BASE=/home/blackcat/.perl5"; export PERL_MM_OPT;
