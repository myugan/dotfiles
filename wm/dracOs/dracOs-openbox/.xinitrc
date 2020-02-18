#load bus 
eval `dbus-launch` 
export DBUS_SESSION_BUS_ADDRESS

# Load Colors & Pulse 
pulseaudio -D &
sleep 2
start-pulseaudio-x11 &
xrdb -merge ~/.Xresources 

# Load bitmap fonts
xset +fp /root/.fonts/ 
xset fp rehash 
sleep 2

# conky
conky -c ~/.config/conky/dracOs-conky

# openbox
exec openbox-session
