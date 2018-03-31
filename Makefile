PWD=$(shell pwd)
DIR="$PWD/home"

all:
	echo "Deploying the dotfiles..."

init: 
	ln -vsf $(DIR)/.colors ~/.colors
	ln -vsf $(DIR)/.config ~/.config
	ln -vsf $(DIR)/.fonts ~/.fonts
	ln -vsf $(DIR)/.local ~/.local
	ln -vsf $(DIR)/.xbm ~/.xbm
	ln -vsf $(DIR)/.x ~/.x
	ln -vsf $(DIR)/.pekwm ~/.pekwm
	ln -vsf $(DIR)/.nano ~/.nano
	ln -vsf $(DIR)/.mpd ~/.mpd
	ln -vsf $(DIR)/.ncmpcpp ~/.ncmpcpp
	ln -vsf $(DIR)/.urxvt ~/.urxvt
	ln -vsf $(DIR)/.vim ~/.vim
	ln -vsf $(DIR)/.zsh ~/.zsh
	ln -vsf $(DIR)/.bashrc ~/.bashrc
	ln -vsf $(DIR)/.zshrc ~/.zshrc
	ln -vsf $(DIR)/.asoundrc ~/.asoundrc
	ln -vsf $(DIR)/.yaourtrc ~/.yaourtrc
	ln -vsf $(DIR)/.nanorc ~/.nanorc
	ln -vsf $(DIR)/.vimrc ~/.vimrc
	ln -vsf $(DIR)/.profile ~/.profile
	ln -vsf $(DIR)/.xinitrc ~/.xinitrc
	ln -vsf $(DIR)/.Xresources ~/.Xresources
	
install:
	sudo pacman -S redshift dunst compton tint2 fish neofetch ranger sxhkd mpd ncmpcpp

aur:
	yaourt -S cava
	yaourt -S jgmenu
	yaourt -S lemonbar
	yaourt -S polybar

update:
	git pull origin master
	git submodule init
	git submodule update
	git submodule foreach git pull origin master