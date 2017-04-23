#!/usr/bin/env bash

source "${BASH_SOURCE%/*}/../deploy/server.sh"

echo "Creating and compressing database dump..."
ssh "$USER@$SERVER" <<-'SSH'
	mongodump --db structureApp --out structureAppDump
	tar -cjf structureAppDump.tar.bz2 structureAppDump
	rm -rf structureAppDump
SSH
echo "OK"

echo "Downloading dump..."
lftp -e "get structureAppDump.tar.bz2 -o $BACKUP_DIR/structureAppDump.`date +%s`.tar.bz2; bye" "sftp://$USER:SSH@$SERVER"
echo "OK"

echo "Removing old backups..."
pushd "$BACKUP_DIR"
ls -tp | grep -v '/$' | tail -n +6 | xargs -d '\n' rm --
popd
echo "OK"
