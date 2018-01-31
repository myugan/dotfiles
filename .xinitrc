#!/bin/bash

. ~/.wmrc

export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8

systemctl --user import-environment DISPLAY

# source for the terminal
xrdb -merge ~/.Xresources &

# Driver
xrandr --auto

# Wallpaper
. ~/.fehbg

# Fonts
xset fp+ ~/.fonts &
xset fp rehash &

# Keyboard layout to us keymap
setxkbmap -layout us &

# Panel
. $BAR/pane
dunst &
ruler &
sxhkd -c $SXHKD &

# Multi session
DEFAULTSESSION=windowchef
case "$1" in
			2bwm)       exec 2bwm ;;
			awesomewm)  exec awesomewm ;;
			dwm)        exec dwm ;;
			windowchef) exec windowchef -c $WCHEF;;
			*)          exec $DEFAULTSESSION ;;
esac