#!/usr/bin/env bash

if [ -n "$CONFIG_FILE" ]; then
	  eval "$( jq -r '. | to_entries[] | "\(.key)=\(@sh "\(.value)")"' "${BASH_SOURCE%/*}/$CONFIG_FILE" )"
fi

echo "Deploying to $SERVER."

echo "Copying files to server..."
lftp -e "mirror --reverse web $SERVER_FOLDER_FRONTEND; bye" "sftp://$USER:SSH@$SERVER"
echo "OK"

echo -e "\nDeploy finished at $(date)"
