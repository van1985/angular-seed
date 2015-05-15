# This is a boostrapper for the Globant Angular Seed project
#
# It installs the required system dependencies (Git, NodeJS, Npm)
# and uses npm to install globally required node packages.
#
# Also it offers to download the source form the git repo and links it to npm
# so when the installation it's donde it can be executed instantly with: 
#
#         yo {generator-name}
#
# Supported OSes:
#	* apt-based (ie Ubuntu)
#	* yum-based	(ie Fedora)
#	* pacman-based (Arch)
#	* zypper-based (Suse)
#	* Mac OS X (Homebrew is autoinstalled if not present)
#

#!/bin/bash

#Uncomment to DEBUG
#set -xv

# CONFIGURATION
# -------------------------------------------------------------------------
APP_NAME="Globant Angular Seed"
GIT_REPO="https://github.com/GlobantMobileStudio/webmobile-basecode.git"
HELP_PAGE="https://github.com/GlobantMobileStudio/webmobile-basecode/wiki/Angular-Seed---Wiki-Home-Page"
GIT_BASE_FOLDER="generator-globant-angular-seed"

#npm required packaged installed with -g
NPM_INSTALL="grunt bower grunt-cli yo"
NPM_INSTALL_FLAGS="--loglevel http"

#gem install deps to install
GEM_INSTALL="compass"

# VARIABLES
# -------------------------------------------------------------------------

OS_TYPE=""
PKG_MANAGER=""
SILENT=0
INSTALL_RESULT=0

# UTILS
# -------------------------------------------------------------------------

#prints a string in color
#usage echoc "Red" "This is printed in red"
echoc(){
    Black='\033[0;30m'      DarkGray='\033[1;30m'
    Blue='\033[0;34m'       LightBlue='\033[1;34m'
    Green='\033[0;32m'      LightGreen='\033[1;32m'
    Cyan='\033[0;36m'       LightCyan='\033[1;36m'
    Red='\033[0;31m'        LightRed='\033[1;31m'
    Purple='\033[0;35m'     LightPurple='\033[1;35m'
    Orange='\033[0;33m'     Yellow='\033[1;33m'
    LightGray='\033[0;37m'  White='\033[1;37m'
    NC='\033[0m'
    eval color=\$$1
    echo -e "${color}$2${NC}"
}

# ENVIRONMENT CHECK AND SETUP
# -------------------------------------------------------------------------

# Check if script is running with root user.
checkRoot(){
    if [ `whoami` = root ]; then
        echoc "Red" "ATTENTION!!!"
        echo " You're running the install script as root!"
        echo " Unless you want to run the app under root only, we recommend executing this script with a non-root user."
        echo " Do you want to proceed anyway?"

        select ryn in Yes No
        do
            case "$ryn" in
                Yes)
                    echo "Proceeding with root..."
                    break
                    ;;
                No)
                    echo "Aborting..."
                    exit 1
                    ;;
            esac
        done
    fi
}

# Check the current environment, set package and setup variables accordingly.
checkEnvironment(){
    OS_TYPE=`uname`

    if type yum &> /dev/null; then
        PKG_MANAGER="yum"
    elif type brew &> /dev/null; then
        PKG_MANAGER="brew"
    elif type apt-get &> /dev/null; then
        PKG_MANAGER="apt"
    elif type pacman &> /dev/null; then
        PKG_MANAGER="pacman"	
    elif type zypper &> /dev/null; then
        PKG_MANAGER="zypper"		
    elif type chocolatey --help &> /dev/null; then
        PKG_MANAGER="chocolatey"		
    else
        if [ "$OS_TYPE" = "Darwin" ]; then
            installHomebrew
        fi
    fi

    if [ "$PKG_MANAGER" = "" ]; then
        echoc "Yellow" "This install script does not support your system, we're sorry :-("
        echoc "Yellow" "Supported systems: Linux Ubuntu, Debian, Fedora, CentOS, Red Hat, and Mac OS X."
        echoc "Yellow" "Supported package managers: APT, YUM and Homebrew."
        echo ""
        exit 1
    fi

    echo "Using package manager: $PKG_MANAGER"

    if [ "$PKG_MANAGER" = "brew" ]; then
        echo "We'll now update brew package definitions..."
        brew update
    fi

    echo ""
    echo "Now checking app dependencies..."
}

# Refresh the path / environment variables.
refreshEnvironment(){
    if [ "$OS_TYPE" = "Darwin" ]; then
        source ~/.bash_profile
    else
        source ~/.bashrc
    fi
}

# Install Homebrew on OS X systems.
installHomebrew(){
    echo "It seems that you don't have Homebrew installed on your system."
    echo "Homebrew is necessary (and highly recommended!) to install some features on Mac OS X systems."

    CONFIRMED=$SILENT

    if [ "$CONFIRMED" = 0 ]; then
        echoc "Yellow" "Do you want to install Homebrew now?"

        select byn in Yes No
        do
            case "$byn" in
                Yes)
                    CONFIRMED=1
                    break
                    ;;
                No)
                    echo "Ignore Homebrew setup."
                    break
                    ;;
            esac
        done
    fi

    if [ "$CONFIRMED" = 1 ]; then
        PKG_MANAGER="brew"
        ruby -e "$(curl -fsSL https://raw.github.com/mxcl/homebrew/go)"
        export PATH=$PATH:/usr/local/share/npm/bin/
        refreshEnvironment
    fi
}

# INSTALL MISSING DEPENDENCIES
# -------------------------------------------------------------------------

# Install a package. If second argument is 1, use NPM to install,
# otherwise use the default package manager.
# you can override the package name for a paraticular package manager defining
# a variable with the following format
#   [pacakgename]_override_[packagemanager]

installPackage(){
    #check if package name is overrided for package manager
    override_name="${1}_override_$PKG_MANAGER"
    eval package=\$$override_name
    #if not
    if [ -z "$package" ]; then
        #set para as package
        package=$1
    fi
    echoc "Yellow" "Installing $package..."

    if [ "$2" = 1 ]; then
        sudo npm install -g $package $NPM_INSTALL_FLAGS
    elif [ "$PKG_MANAGER" = "yum" ]; then
        sudo yum --enablerepo=updates-testing install -y "$package"
    elif [ "$PKG_MANAGER" = "apt" ]; then
        sudo apt-get --ignore-missing -y install "$package"
    elif [ "$PKG_MANAGER" = "pacman" ]; then
        sudo pacman --noconfirm -S "$package"
    elif [ "$PKG_MANAGER" = "zypper" ]; then
        sudo zypper --non-interactive install "$package"
    elif [ "$PKG_MANAGER" = "chocolatey" ]; then
        cinst "$package"
    else
        brew install "$package"
    fi

    refreshEnvironment
}


# Confirm package installation by prompting the user, or auto installing if SILENT is 1.
confirmInstall(){
    if [ "$SILENT" = 1 ]; then
        installPackage $1 $2
        return 1
    else
        echo ""
        echoc "Yellow" "Do you want to install $1 now?"

        select iyn in Yes No
        do
            case "$iyn" in
                Yes)
                    installPackage $1 $2
                    break
                    ;;
                No)
                    echo "Ignore dependency: $1"
                    break
                    ;;
            esac
        done
    fi
}

# DEPENDENCY CHECK
# -------------------------------------------------------------------------

# Prints a message about a dependency.
# First argument defines if dependency is optional (0 is required, 1 is optional).
aboutDependency(){
    echo ""
    echo "$1"

    if [ "$2" -eq 1 ]; then
        echo "It's optional but recommended."
    fi
}

# Check for a dependency using the which command.
# Dependency name is passed as an argument.
checkDependency(){
    type "$1"&> /dev/null;
}

# Check if GIT is installed (git: required).
checkGit(){
    if checkDependency "git"; then
        echoc "LightBlue" "GIT is installed!"
    else
        aboutDependency "The System App needs GIT to be able to download and update its source code." 0
        confirmInstall "git" 0
    fi
}

# Check if Node.js is installed (node: required).
checkNode(){
    if checkDependency "node"; then
        echoc "LightBlue" "Node.js is installed!"
    else
        aboutDependency "The System App needs Node.js to run." 0

        if [ "$PKG_MANAGER" = "brew" ]; then
            confirmInstall "node" 0
        else
            if [ "$PKG_MANAGER" = "apt" ]; then
                checkNodeAptRepo
            fi
            confirmInstall "nodejs" 0
        fi
    fi
}

# Check if Node.js is installed (node: required).
checkJava(){
    if checkDependency "java"; then
        echoc "LightBlue" "Java is installed!"
    else
        aboutDependency "Some dependencies need Java to run." 0
        if [ "$PKG_MANAGER" = "brew" ]; then
            echoc "Red" "Java cannot be installed automatically in Mac OS X, please install it manually."
        else
            #override java for every distro
            java_override_apt='openjdk-7-jre'
            java_override_pacman='jdk7-openjdk'
            java_override_yum='java-1.7.0-openjdk'
            java_override_zypper='java-1_7_0-openjdk'
            java_override_chocolatey='javaruntime'
            confirmInstall "java" 0
        fi
    fi
}

# Check if Node.js is installed (node: required).
checkRuby(){
    if checkDependency "ruby"; then
        echoc "LightBlue" "Ruby is installed!"
    else
        aboutDependency "Some dependencies need Ruby to run." 0
        confirmInstall "ruby" 0
    fi
    if checkDependency "ruby"; then
        echo ""
        echoc "LightGreen" "Installing required Ruby Gems..."
        sudo gem install $GEM_INSTALL
    fi
}


# Check if Node.js repository is set on APT.
checkNodeAptRepo(){
    echo "Before installing Node.js, you must add the chris-lea/node.js repository to your system."

    CONFIRMED=$SILENT

    if [ "$CONFIRMED" = 0 ]; then
        echoc "Yellow" "Do you want to add the node.js repository now?"

        select nyn in Yes No
        do
            case "$nyn" in
                Yes)
                    CONFIRMED=1
                    break
                    ;;
                No)
                    echo "Skip (do not add chris-lea/node.js repository)."
                    break
                    ;;
            esac
        done
    fi

    if [ "$CONFIRMED" = 1 ]; then
        sudo add-apt-repository -y ppa:chris-lea/node.js
        sudo apt-get update
    fi
}

# Check if NPM is installed (npm: required).
checkNpm(){
    if checkDependency "npm"; then
        echoc "LightBlue" "NPM is installed!"
    else
        aboutDependency "$APP_NAME needs NPM to maintain its Node.js modules." 0
        confirmInstall "npm" 0
    fi
    if checkDependency "npm"; then
        echo ""
        echoc "LightGreen" "Installing node required packages..."
        sudo npm install -g $NPM_INSTALL $NPM_INSTALL_FLAGS
    fi
}


# POST INSTALL
# -------------------------------------------------------------------------

# Download latest source code from GitHub.
downloadFromGit(){
    if [ ! -d ./.git ] || ! [ -d "./$GIT_BASE_FOLDER" ]; then
        echo "It seems you have not downloaded the $APP_NAME source from its GIT repository."

        CONFIRMED=$SILENT

        if [ "$CONFIRMED" = 0 ]; then
            echoc "Yellow" "Do you want to download the latest source to the current folder now?"

            select dyn in Yes No
            do
                case "$dyn" in
                    Yes)
                        CONFIRMED=1
                        break
                        ;;
                    No)
                        echo "Do not download the source files!"
                        break
                        ;;
                esac
            done
        fi

        if [ "$CONFIRMED" = 1 ]; then
            echo "Clone the $APP_NAME repository..."
            git clone $GIT_REPO ./source_tmp
            rm -f source_tmp/install.sh
            mv -f source_tmp/* ./
            mv -f source_tmp/.git ./
            rm -fr source_tmp
        fi
    fi
}

prepareGenerator(){
    cd "$GIT_BASE_FOLDER"
    echo "Installing Node.js modules..."
    sudo npm install $NPM_INSTALL_FLAGS
    echo "Linking folder to npm..."
    sudo npm link
    INSTALL_RESULT=$?
}



# RUN SCRIPT
# -------------------------------------------------------------------------
# Init the install script by running the sub functions.

echo ""
echoc "LightGreen" "$APP_NAME INSTALL SCRIPT"
echo ""
echo " This script will help you installing and configuring the $APP_NAME"
echo " If you have problems please get help on our help page:"
echo ""
echoc "LightBlue" "    $HELP_PAGE"
echo ""

echo $XAA

if [ "$1" = "-y" ]; then
    SILENT=1
    echo "Running in silent mode: all prompts will be automatically accepted!"
else
    echo "During the execution, you'll be asked to confirm the installation of specific packages."
    echo "Pressing 1 selects Yes, and 2 selects No."
fi

echo ""

checkRoot
checkEnvironment
echo ""
checkGit
checkNode
checkNpm
checkJava
checkRuby
echo ""
downloadFromGit
prepareGenerator

if [ "$INSTALL_RESULT" -eq 0 ]; then 
    echo ""
    echoc "LightGreen" "$APP_NAME INSTALLED"
    echo ""
    echo " Create a new directory and bootstrap your app with:"
    echo ""
    echoc "LightGreen" "    yo globant-angular-seed"
else
    echo ""
    echoc "Red" "There was an ERROR installing $APP_NAME"
    echo ""
    echo "Please review the log for problems in your system and run this installer again."
fi

echo ""
echo " If you need help go please visit: "
echo ""
echoc "LightBlue" "    $HELP_PAGE"
echo ""
