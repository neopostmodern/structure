#!/usr/bin/env bash

if [ -n "$CONFIG_FILE" ]; then
	  eval "$( jq -r '. | to_entries[] | "\(.key)=\(@sh "\(.value)")"' "${BASH_SOURCE%/*}/$CONFIG_FILE" )"
fi

echo "Creating and compressing database dump..."
ssh "$USER@$SERVER" <<-'SSH'
	mongodump --db structureApp --out structureAppDump
	tar -cjf structureAppDump.tar.bz2 structureAppDump
	rm -rf structureAppDump
SSH
echo "OK"

echo "Downloading dump..."
lftp -e "get structureAppDump.tar.bz2 -o $BACKUP_DIR/structureAppDump.`date --iso-8601=seconds`.tar.bz2; rm structureAppDump.tar.bz2; exit" "sftp://$USER:SSH@$SERVER"
echo "OK"

echo "Removing old backups..."
rotate-backups --daily 7 --monthly always --prefer-recent "$BACKUP_DIR"
echo "OK"
