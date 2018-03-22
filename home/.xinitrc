#!/bin/bash
#
#      ▘  ▘▗     
#    ▚▘▌▛▌▌▜▘▛▘▛▘
#  ▗ ▞▖▌▌▌▌▐▖▌ ▙▖ 
#
#  Start needed programs with multi session options.
#
#  Author : blackcat - https://github.com/noirecat
#  Usage : 
#      startx ~/.xinitrc [session]
#

if [ -d /etc/X11/xinit/xinitrc.d ] ; then
    for f in /etc/X11/xinit/xinitrc.d/?*.sh ; do
        [ -x "$f" ] && . "$f"
    done
    unset f
fi

# screen
xrandr --output HDMI1 --auto

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

# multi session
2bwm(){
    exec 2bwm
}
dwm(){
    exec dwm
}
openbox(){
    exec openbox-session
}
wchef(){
    exec windowchef
}

case $1 in
    dwm)    dwm;;
    ob)     openbox;;
    wchf)   wchef;;
    *)      openbox;;
esac
