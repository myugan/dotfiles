# intellegently extract archives based on extension. 
function extract {  
   
   file=$1
   dir=$2

   if [[ -n $dir ]]; then
      mkdir -p $dir; 
      echo Extracting $1 into $2 ...
   else 
      echo Extracting $1 ...
   fi

   if [[ ! -f $1 ]] ; then
      echo "'$1' is not a valid file"
   else
      case $1 in
         *.tar.bz2)   
             if [[ -n $dir ]]; then dc="-C $dir"; fi
             cmd="tar xjvf $1 $dc" 
             echo $cmd
             eval ${cmd}
             ;;   
         *.tar.gz)    
             if [[ -n $dir ]]; then dc="-C $dir"; fi
             cmd="tar xzvf $1 $dc"; 
             echo $cmd;
             eval ${cmd}
             ;;
         *.tar)       
             if [[ -n $dir ]]; then dc="-C $dir"; fi
             cmd="tar vxf $1 $dc";
             echo $cmd;
             eval ${cmd}
             ;;
         *.tbz2)      
             if [[ -n $dir ]]; then dc="-C $dir"; fi
             cmd="tar xjvf $1 $dc";
             echo $cmd; 
             eval ${cmd}
             ;;  
         *.tgz) 
             if [[ -n $dir ]]; then dc="-C $dir"; fi
             cmd="tar xzf $1 $dc"; 
             echo $cmd; 
             eval ${cmd} 
             ;;    
         *.bz2)       
             if [[ -n $dir ]]; then dc="-C $dir"; fi
             cmd="tar jf $1 $dc"; 
             echo $cmd; 
             eval ${cmd} 
             ;;     
         *.zip)       
             if [[ -n $dir ]]; then dc="-d $dir"; fi
             cmd="unzip $1 $dc"; 
             echo $cmd; 
             eval ${cmd}
             ;;
         *.gz)
             if [[ -n $dir ]]; then dc="-C $dir"; fi
             cmd="tar zf $1 $dc"; 
             echo $cmd; 
             eval ${cmd}
             ;;
         *.7z)        
             #TODO dir
             cmd="7z x -o$dir $1"; 
             echo $cmd; 
             eval ${cmd} 
             ;;
         *.rar)       
             #TODO Dir
             cmd="unrar x $1 $dir";
             echo $cmd;
             eval ${cmd}
             ;;
         *)           
            echo "'$1' cannot be extracted via extract()" 
            ;;
         esac
   fi
}

# Make a directory and cd into it
function take {
    mkdir -p $1
    cd $1
}

# web_search from terminal
function web_search() {
  emulate -L zsh

  # define search engine URLS
  typeset -A urls
  urls=(
    google      "https://www.google.com/search?q="
    ddg         "https://www.duckduckgo.com/?q="
    github      "https://github.com/search?q="
  )

  # check whether the search engine is supported
  if [[ -z "$urls[$1]" ]]; then
    echo "Search engine $1 not supported."
    return 1
  fi

  # search or go to main page depending on number of arguments passed
  if [[ $# -gt 1 ]]; then
    # build search url:
    # join arguments passed with '+', then append to search engine URL
    url="${urls[$1]}${(j:+:)@[2,-1]}"
  else
    # build main page url:
    # split by '/', then rejoin protocol (1) and domain (2) parts with '//'
    url="${(j://:)${(s:/:)urls[$1]}[1,2]}"
  fi

  open_command "$url"
}

#use generalized open command
function open_command() {
  emulate -L zsh
  setopt shwordsplit

  local open_cmd

  # define the open command
  case "$OSTYPE" in
    darwin*)  open_cmd='open' ;;
    cygwin*)  open_cmd='cygstart' ;;
    linux*)   open_cmd='xdg-open' ;;
    msys*)    open_cmd='start ""' ;;
    *)        echo "Platform $OSTYPE not supported"
              return 1
              ;;
  esac

  # don't use nohup on OSX
  if [[ "$OSTYPE" == darwin* ]]; then
    $open_cmd "$@" &>/dev/null
  else
    nohup $open_cmd "$@" &>/dev/null
  fi
}

# Show dots while waiting for tab-completion
expand-or-complete-with-dots() {
    # toggle line-wrapping off and back on again
    [[ -n "$terminfo[rmam]" && -n "$terminfo[smam]" ]] && echoti rmam
    print -Pn "%{%F{red}......%f%}"
    [[ -n "$terminfo[rmam]" && -n "$terminfo[smam]" ]] && echoti smam

    zle expand-or-complete
    zle redisplay
}
zle -N expand-or-complete-with-dots
bindkey "^I" expand-or-complete-with-dots