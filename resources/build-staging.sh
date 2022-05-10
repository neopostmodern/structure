cd "${BASH_SOURCE%/*}/../config/" || exit 1
mv "config.json" "config-temp.json"
cp "config-staging.json" "config.json"
pushd ..
npm run "client:build:electron"
popd || exit 1
rm "config.json"
mv "config-temp.json" "config.json"
