#!/usr/bin/env bash

ssh "$USER@$SERVER" <<EOT
pm2 stop "${PROCESS_NAME}"
mongodump --archive --db=structureApp | mongorestore --drop --archive --nsFrom='structureApp.*' --nsTo='structureApp-staging.*'
EOT
