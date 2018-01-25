#!/usr/bin/env bash

source "$1"

echo "Deploying to $SERVER."

echo "Copying files to server..."
lftp -e "mirror --reverse dist backend; bye" "sftp://$USER:SSH@$SERVER"
echo "OK"

echo "Installing dependencies on server..."
ssh "$USER@$SERVER" "cd backend && yarn install --production"
echo "OK"

echo "Starting backend service (as pm2-process '$PROCESS_NAME')..."
NODE_ARGS="--node-args=\"--harmony_object_values_entries\""
ssh "$USER@$SERVER" "pm2 restart $PROCESS_NAME $NODE_ARGS || pm2 start backend/server.js --name $PROCESS_NAME $NODE_ARGS"
echo "OK"

TIME=`date`
echo -e "\nDeploy finished at $TIME"
