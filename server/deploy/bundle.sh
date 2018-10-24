#!/usr/bin/env bash

LIB_DIR=`realpath "${BASH_SOURCE%/*}/../lib"`

mkdir -p dist
./node_modules/.bin/rollup -e "${LIB_DIR}/config.json" lib/config.js -f cjs -o dist/config.js
cp deploy/config.json dist/config.json
cp package.json package-lock.json dist/
