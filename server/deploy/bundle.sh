#!/usr/bin/env bash

mkdir -p dist
cp deploy/config.json dist/config.json
cp package.json dist/package.json
cp yarn.lock dist/yarn.lock

