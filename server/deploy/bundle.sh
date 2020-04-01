#!/usr/bin/env bash

if [ -z "$CONFIG_FILE" ]; then
	  echo "Need a CONFIG_FILE env value to bundle!"
	  exit 1
fi

LIB_DIR=$(realpath "${BASH_SOURCE%/*}/../lib")

mkdir -p dist
./node_modules/.bin/rollup -e "${LIB_DIR}/config.json" lib/config.js -f cjs -o dist/config.js
cp "deploy/$CONFIG_FILE" dist/config.json
cp package.json package-lock.json dist/
