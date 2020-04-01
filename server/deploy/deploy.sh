#!/usr/bin/env bash

if [ -n "$CONFIG_FILE" ]; then
	  eval "$( jq -r '. | to_entries[] | "\(.key)=\(@sh "\(.value)")"' "${BASH_SOURCE%/*}/$CONFIG_FILE" )"
fi

echo "Deploying to $SERVER."

if [ -n "$RUN_PREFLIGHT" ]; then
   echo "Running preflight code..."
   source "$RUN_PREFLIGHT"
   echo "Preflight complete."
fi

echo "Copying files to server..."
lftp -e "mirror --reverse dist $SERVER_FOLDER_BACKEND; bye" "sftp://$USER:SSH@$SERVER"
echo "OK"

echo "Installing dependencies on server..."
ssh "$USER@$SERVER" "cd $SERVER_FOLDER_BACKEND && npm ci --only=production"
# currently using fork of 'feed' package, needs build (which happens upon `npm install`)
ssh "$USER@$SERVER" "cd $SERVER_FOLDER_BACKEND/node_modules/feed && npm install"
echo "OK"

echo "Starting backend service (as pm2-process '$PROCESS_NAME')..."
ssh "$USER@$SERVER" "pm2 restart \"$PROCESS_NAME\" $NODE_ARGS || pm2 start $SERVER_FOLDER_BACKEND/server.js --name \"$PROCESS_NAME\" $NODE_ARGS"
echo "OK"

echo -e "\nDeploy finished at $(date)"
