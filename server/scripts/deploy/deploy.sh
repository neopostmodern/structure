#!/usr/bin/env bash

if [ -n "$CONFIG_FILE" ]; then
	  eval "$( jq -r '. | to_entries | .[] | .key + "=" + (.value | tostring | @sh)' "${BASH_SOURCE%/*}/../../../config/$CONFIG_FILE" )"
fi

echo "Deploying to $SERVER."

if [ -n "$RUN_PREFLIGHT" ]; then
   echo "Running preflight code..."
   source "${BASH_SOURCE%/*}/$RUN_PREFLIGHT"
   echo "Preflight complete."
fi

echo "Copy files to server and unpack..."
ssh "$USER@$SERVER" "rm -rf $SERVER_FOLDER_BACKEND && mkdir $SERVER_FOLDER_BACKEND"
lftp -c "open sftp://$USER:SSH@$SERVER; put -O $SERVER_FOLDER_BACKEND server.tar"
ssh "$USER@$SERVER" "cd $SERVER_FOLDER_BACKEND && tar xf server.tar && rm server.tar"
echo "OK"

echo "Starting backend service (as systemd service '$SYSTEMD_SERVICE_NAME')..."
ssh "$USER@$SERVER" "systemd --user restart $SYSTEMD_SERVICE_NAME"
echo "OK"

echo -e "\nDeploy finished at $(date)"
