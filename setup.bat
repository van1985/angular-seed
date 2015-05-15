@echo off
REM insall chocolatey
echo **** Installing Chocolatey ****
@powershell -NoProfile -ExecutionPolicy unrestricted -Command "iex ((new-object net.webclient).DownloadString('https://chocolatey.org/install.ps1'))" && SET PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin

REM install git to have bash available
echo **** Installing Git ****
cmd /c cinst git

REM run setup
echo **** Running Bootstrap Script ****

REM determine git shell location
SET sh_path_64="%ProgramFiles%\Git\bin\sh.exe"
SET sh_path_86="%ProgramFiles% (x86)\Git\bin\sh.exe"
IF EXIST %sh_path_64% (
    SET sh=%sh_path_64% --login -i
)
IF EXIST %sh_path_86%= (
    SET sh=%sh_path_86% --login -i
)

REM run bash commands
IF DEFINED sh (
    REM prepare fake sudo file
    echo #!/usr/bin/bash > sudo
    echo $@ >> sudo
    %sh% > bash -c "cp sudo /usr/bin/sudo"
    del sudo
    REM run bash command using git shell
    %sh% > bash setup.sh
) ELSE (
    echo "Couldn't find Git shell installation path"
    EXIT /b
)
