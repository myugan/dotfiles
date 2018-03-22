#
#  ▐▘▘  ▌
#  ▜▘▌▛▘▛▌
#  ▐ ▌▄▌▌▌
#

# Path
test -d "/sbin"; and set PATH "/sbin" $PATH
test -d "/bin"; and set PATH "/bin"
test -d "/usr/sbin"; and set PATH "/usr/sbin" $PATH
test -d "/usr/bin"; and set PATH "/usr/bin" $PATH
test -d "/usr/local/sbin"; and set PATH "/usr/local/sbin" $PATH
test -d "/usr/local/bin"; and set PATH "/usr/local/bin" $PATH
test -d "$HOME/.local/bin"; and set PATH "$HOME/.local/bin" $PATH

set -U fish_prompt_pwd_dir_length 0

set -g __fish_git_prompt_show_informative_status 1
set -g __fish_git_prompt_hide_untrackedfiles 1
set -g __fish_git_prompt_char_stagedstate "●"
set -g __fish_git_prompt_char_dirtystate "✚"
set -g __fish_git_prompt_char_untrackedfiles "…"
set -g __fish_git_prompt_char_conflictedstate "✖"
set -g __fish_git_prompt_char_cleanstate "✔"

set -l configdir ~/.config

if set -q XDG_CONFIG_HOME
    set configdir $XDG_CONFIG_HOME
end

set -l userdatadir ~/.local/share

if set -q XDG_DATA_HOME
    set userdatadir $XDG_DATA_HOME
end

# Globals
set -gx LANG en_US.UTF-8
set -gx VISUAL vi
set -gx EDITOR vi
set -gx PAGER less

# Prompt
function fish_prompt
    set_color blue
    printf ' %s ' (whoami)@(hostname)
    set_color white
    echo -n (prompt_pwd) 
    echo -n ' '
end

function fish_right_prompt
	set_color white
	date "+%H:%M %p"
end

function fish_title
    echo (whoami)@(hostname) (prompt_pwd)
end
funcsave fish_title

# Syntax highlighthing
for color in (set | grep -Eo '^fish_color_[a-zA-Z0-9_]+')
    set $color normal
end

set fish_color_autosuggestion black
set fish_color_error red
set fish_pager_color_progress white

function reload
    . $HOME/.config/fish/config.fish
end

function .
	bash
end

# Disable the welcome text
set --erase fish_greeting

# Disable GREP_OPTIONS
set --erase GREP_OPTIONS

# Fish shell
set -g -x fish_greeting ''
set -g -x __fish_git_prompt_showdirtystate 1
set -g -x __fish_git_prompt_showstashstate 1
set -g -x __fish_git_prompt_showuntrackedfiles 1
set -g -x __fish_git_prompt_showupstream auto,verbose
set -g -x __fish_git_prompt_color magenta
set -g -x __fish_git_prompt_color_dirtystate red
set FISH_CLIPBOARD_CMD "cat"

# Directories traversal
function ..; cd ..; end
function ...; cd ../..; end
function ....; cd ../../..; end
function cd..; cd ..; end
function less; command less -R $argv; end

# Directories listing
function ls
  command ls -l --color $argv
end

function la
  command ls -al --color $argv
end

if not command --search --quiet "$command_name"
    exit 1
end