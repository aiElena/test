#!/usr/bin/env sh

GREEN='\033[0;32m'
NC='\033[0m'
branch=$(git rev-parse --symbolic-full-name --abbrev-ref HEAD)

git add ./src
git commit -am "Finish commit"
git push -u origin "${branch}"
printf "${GREEN}\n All done!${NC}"