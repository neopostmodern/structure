#!/usr/bin/env bash
node node_modules/migrate-mongoose/dist/cli.js create -d mongodb://localhost:27017/structureApp $1
