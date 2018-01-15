#!/usr/bin/env sh

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m'

git checkout master
git pull

if ! [ -d "./.blocks-library" ]; then
  git clone git@github.com:webliumteam/blocks-library.git .blocks-library
else
  cd ./.blocks-library
  git pull
  cd ../
fi

printf "${GREEN}\nPlease select one of the following block wireframes to start:\n\n${NC}"

for i in $(ls -d ./.blocks-library/*/); do printf "${i}" | sed 's/\/$//' | sed "s/^.*\///g"  | (printf "${CYAN}\t *${NC} " && cat); done

while [ -z "$block_wire" ]
do
  read -p "`printf $'\nBlock wireframe:'` " block_wire
  if [ -z "$block_wire" ]; then
    echo "${YELLOW}Please enter non empty string${NC}"
  fi
done

if ! [ -d "./.blocks-library/${block_wire}" ]; then
  printf "${RED}\nNo wireframe "\'${block_wire}\'" found. Script will be terminated${NC}"
  echo ""
  exit
fi

printf "${GREEN}\nThose types are avaliable for ${block_wire} wireframe, please select one:\n\n${NC}"
for i in $(ls -d ./.blocks-library/${block_wire}/*/); do printf "${i}" | sed 's/\/$//' | sed "s/^.*\///g"  | (printf "${CYAN}\t *${NC} " && cat); done


while [ -z "$wire_type" ]
do
  read -p "`printf $'\nWireframe type:'` " wire_type
  if [ -z "$wire_type" ]; then
    echo "${YELLOW}Please enter non empty string${NC}"
  fi
done

if ! [ -d "./.blocks-library/${block_wire}/${wire_type}" ]; then
  printf "${RED}\nNo wireframe type "\'${wire_type}\'" found. Script will be terminated${NC}"
  echo ""
  exit
fi

printf "${GREEN}\nAlso please provide block name\n${NC}"

while [ -z "$block_name" ]
do
  read -p "`printf $'\nBlock name:'` " block_name
  if [ -z "$block_name" ]; then
    echo "${YELLOW}Please enter non empty string${NC}"
  fi
done

printf "${GREEN}\nJust a moment...\n${NC}"

git checkout -b "${block_wire}/${wire_type}/${block_name}"
cp -rf "./.blocks-library/${block_wire}/${wire_type}/wireframe/src" ./
rm -rf .blocks-library
git add ./src
git commit -am "Init commit"

printf "${GREEN}\nAll done!\n${NC}"