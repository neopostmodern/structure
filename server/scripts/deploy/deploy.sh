#!/usr/bin/env bash

if [ -n "$CONFIG_FILE" ]; then
	  eval "$( jq -r '. | to_entries[] | "\(.key)=\(@sh "\(.value)")"' "${BASH_SOURCE%/*}/../../../config/$CONFIG_FILE" )"
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

echo "Starting backend service (as pm2-process '$PROCESS_NAME')..."
PM2_NODE_ARGS="--interpreter=\$(which node)"
if [ -n "$NODE_ARGS" ]; then
	 PM2_NODE_ARGS="$PM2_PM2_NODE_ARGS --node-args=\"$NODE_ARGS\""
fi
ssh "$USER@$SERVER" "bash -l -c 'export NODE_ENV=\"production\"; pm2 restart \"$PROCESS_NAME\" $PM2_NODE_ARGS || pm2 start --cwd $SERVER_FOLDER_BACKEND/server/ --name \"$PROCESS_NAME\" $PM2_NODE_ARGS \$(which npm) -- start'"
echo "OK"

echo -e "\nDeploy finished at $(date)"
