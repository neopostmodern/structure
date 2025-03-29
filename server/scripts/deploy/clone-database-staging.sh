#!/usr/bin/env bash

ssh "$USER@$SERVER" <<EOT
systemctl --user stop $SYSTEMD_SERVICE_NAME || true
mongodump --archive --db=structureApp | mongorestore --drop --archive --nsFrom='structureApp.*' --nsTo='structureApp-staging.*'
EOT
