#!/bin/bash
#
# Start needed programs for multi session
#
# usage : 
#	startx ~/.xinitrc (session)
# example :
#	startx ~/.xinitrc dwm
#

# load the profile
source ~/.profile

# source for the terminal
xrdb -merge ~/.Xresources &

xsetroot -cursor_name left_ptr &

start-pulseaudio-x11 &

pgrep redshift &> /dev/null || redshift &> /dev/null &


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
