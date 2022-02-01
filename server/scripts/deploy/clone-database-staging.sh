#!/usr/bin/env bash

ssh "$USER@$SERVER" <<EOT
pm2 stop "${PROCESS_NAME}"
mongo --eval "conn = new Mongo(); db = conn.getDB('structureApp-staging'); db.dropDatabase(); db.copyDatabase('structureApp', 'structureApp-staging');"
EOT
