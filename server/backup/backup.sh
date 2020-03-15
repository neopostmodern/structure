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
lftp -c "set sftp:connect-program \"connect sftp://$USER:SSH@$SERVER; get structureAppDump.tar.bz2 -o $BACKUP_DIR/structureAppDump.`date +%s`.tar.bz2"
echo "OK"

echo "Removing old backups..."
pushd "$BACKUP_DIR"
ls -tp | grep -v '/$' | tail -n +15 | xargs -d '\n' rm --
popd
echo "OK"
