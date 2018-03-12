#!/bin/bash
#
# Author : blackcat - https://github.com/noirecat
# 
# Start needed programs with multi session
#
# usage : 
#	startx ~/.xinitrc (session)
# example :
#	startx ~/.xinitrc dwm
#

if [ -d /etc/X11/xinit/xinitrc.d ] ; then
    for f in /etc/X11/xinit/xinitrc.d/?*.sh ; do
        [ -x "$f" ] && . "$f"
    done
    unset f
fi

# load the profile
source ~/.profile

# source the fonts
xset +fp /usr/share/fonts/misc
xset +fp ~/.fonts
xset fp rehash

# source for the terminal
xrdb -merge ~/.Xresources &

xsetroot -cursor_name left_ptr &

start-pulseaudio-x11 &

pgrep redshift &> /dev/null || redshift &> /dev/null &

# set wall
. ~/.fehbg

case $1 in
		dwm	)
			exec dwm ;;
		ob	)
			exec openbox-session ;;
		wchf	)
			exec windowchef ;;
		xfce ) 
			exec startxfce4 ;;
		*) 
			exec windowchef ;;
esac
