#!/bin/bash

export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8

# dunst to be better
systemctl --user import-environment DISPLAY

# Set cursor from X to pointer
xsetroot -cursor_name left_ptr &

start-pulseaudio-x11 &

# source for the terminal
xrdb -merge ~/.Xresources &

# Driver
xrandr --auto

# Services
urxvtd -q -o -f &
xrdb -q &

# wallpaper
. ~/.fehbg

# Fonts
xset fp+ ~/.fonts &
xset fp rehash &

# Keyboard layout to us keymap
setxkbmap -layout us &

# Multi session
wm=windowchef
case "$1" in
			awesomewm)  exec awesome ;;
			windowchef) exec windowchef -c $WCHEF;;
			*)          exec $wm ;;
esac