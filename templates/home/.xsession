#!/bin/bash
#
#            ▘    
#  ▚▘▛▘█▌▛▘▛▘▌▛▌▛▌
#  ▞▖▄▌▙▖▄▌▄▌▌▙▌▌▌
#
#  by blackcat
#

## Set font paths
xset fp+ /usr/share/fonts/misc
xset fp+ ~/.fonts
xset fp rehash
sleep 2

## Configuring monitor
if [[ -z `xrandr | grep " connected" | grep 'VGA'` ]]; then
		echo "No monitor found" &
else
	xrandr --output HDMI1 --auto &
fi

## Set pointer speed
xset r m 0 01 &

## Localized current user directory
xdg-user-dirs-gtk-update &

## Source for the terminal
xrdb -merge ~/.Xresources &


