#!/bin/sh
#
# This script is an edit of ufetch
#

## INFO
hostname="$(hostname)"
os() {
     os=$(source /etc/os-release && echo $ID)
     export os
}
packages="$(pacman -Q | wc -l)"
kernel="$(uname -r)"
uptime="$(uptime -p | sed 's/up //')"
shell=$(basename $SHELL)
wm() {
     id=$(xprop -root -notype _NET_SUPPORTING_WM_CHECK)
     id=${id##* }
     wm=$(xprop -id "$id" -notype -len 100 -f _NET_WM_NAME 8t)
     wm=${wm/*_NET_WM_NAME = }
     wm=${wm/\"}
     wm=${wm/\"*}
     wm=${wm,,}
     export wm
}


## DEFINE COLORS
# Don't change
bc="$(tput bold)"	# bold
c0="$(tput setaf 0)"	# black
c1="$(tput setaf 1)"	# red
c2="$(tput setaf 2)"	# green
c3="$(tput setaf 3)"	# yellow
c4="$(tput setaf 4)"	# blue
c5="$(tput setaf 5)"	# magenta
c6="$(tput setaf 6)"	# cyan
c7="$(tput setaf 7)"	# white
rc="$(tput sgr0)"	# reset

# You can change these
nc="${rc}${bc}${c4}"	# user and hostname
ic="${rc}"	        # info
fc="${rc}${c4}${bc}"	# first color
sc="${rc}${bc}${c7}"	# second color

## Exec
os
wm

## OUTPUT
cat <<EOF

${fc}        .-'		
${fc}    '--./ /     _.---.	
${fc}    '-,  (__..-'       \	
${fc}       \          ${sc}.${fc}     |
${fc}        ',.__.   ,__.--/	
${sc}          '._${sc}/_.'${sc}___.-'

${nc}    ${USER}${ic}@${nc}${hostname}
${fc}    OS:${fc}       ${ic}${os}
${fc}    Kernel: ${fc}  ${ic}${kernel}
${fc}    Pkgs: ${fc}    ${ic}${packages}
${fc}    WM: ${fc}      ${ic}${wm}
${fc}    SHELL: ${fc}   ${ic}${shell}
${rc}
EOF