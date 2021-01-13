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

echo "Cloning on server..."
if [ -n "$GIT_BRANCH" ]; then
   GIT_ARGUMENTS="--branch $GIT_BRANCH"
fi
ssh "$USER@$SERVER" "rm -rf $SERVER_FOLDER_BACKEND; git clone $GIT_ARGUMENTS https://github.com/neopostmodern/structure $SERVER_FOLDER_BACKEND"
echo "OK"

echo "Copy decrypted config file to server..."
lftp -c "open sftp://$USER:SSH@$SERVER; put -O $SERVER_FOLDER_BACKEND/server/lib/ ${BASH_SOURCE%/*}/$CONFIG_FILE -o config.json"
echo "OK"

echo "Installing dependencies on server..."
ssh "$USER@$SERVER" "cd $SERVER_FOLDER_BACKEND/server && npm ci --only=production"
# currently using fork of 'feed' package, needs build (which happens upon `npm install`)
ssh "$USER@$SERVER" "cd $SERVER_FOLDER_BACKEND/server/node_modules/feed && npm install"
echo "OK"

echo "Starting backend service (as pm2-process '$PROCESS_NAME')..."
if [ -n "$NODE_ARGS" ]; then
	 PM2_NODE_ARGS="--node-args=\"$NODE_ARGS\""
fi
ssh "$USER@$SERVER" "[ -s \"~/.nvm/nvm.sh\" ] && \. \"~/.nvm/nvm.sh\"; pm2 restart \"$PROCESS_NAME\" $PM2_NODE_ARGS || pm2 start --cwd $SERVER_FOLDER_BACKEND/server/ --name \"$PROCESS_NAME\" $PM2_NODE_ARGS $(which npm) -- start"
echo "OK"

echo -e "\nDeploy finished at $(date)"
