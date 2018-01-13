#!/bin/bash

if [ -z "$1" ]; then
    echo "Folder name is required"
    exit
fi

cd ../blocks-library/

mkdir -p "$1"

cd ../block-boilerplate
# copy folder with name 
cp -r ./src ../blocks-library/"$1"/
cp -r ./dist ../blocks-library/"$1"/
# change dir to new folder
cd ../blocks-library/
# change branch
git checkout develop
#git pull
git pull
# add new folder to git index
git add ./"$1"
# commit
git commit -m "add $1"
# push
git push origin develop