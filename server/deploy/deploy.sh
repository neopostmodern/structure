#!/usr/bin/env bash

source "$1"

echo "Deploying to $SERVER."

if [ -n "$RUN_PREFLIGHT" ]; then
   echo "Running preflight code..."
   source "$RUN_PREFLIGHT"
   echo "Preflight complete."
fi

if [ -n "$CONFIG_FILE" ]; then
   echo "Overriding config file..."
   cp "$CONFIG_FILE" ./dist/config.json
   echo "OK"
fi

echo "Copying files to server..."
lftp -e "mirror --reverse dist $SERVER_FOLDER; bye" "sftp://$USER:SSH@$SERVER"
echo "OK"

# todo: switch to npm
echo "Installing dependencies on server..."
ssh "$USER@$SERVER" "cd $SERVER_FOLDER && npm install --production"
echo "OK"

echo "Starting backend service (as pm2-process '$PROCESS_NAME')..."
ssh "$USER@$SERVER" "pm2 restart \"$PROCESS_NAME\" $NODE_ARGS || pm2 start $SERVER_FOLDER/server.js --name \"$PROCESS_NAME\" $NODE_ARGS"
echo "OK"

TIME=`date`
echo -e "\nDeploy finished at $TIME"
