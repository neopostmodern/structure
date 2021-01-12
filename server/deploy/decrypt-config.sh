gpg --quiet --batch --yes --decrypt --passphrase="${CONFIG_DECRYPT_PASSPHRASE}" --output "${BASH_SOURCE%/*}/${CONFIG_FILE}" "${BASH_SOURCE%/*}/${CONFIG_FILE}.gpg"
[[ $CONFIG_FILE != "config.json" ]] && cp "${BASH_SOURCE%/*}/${CONFIG_FILE}" "${BASH_SOURCE%/*}/config.json"
cp "${BASH_SOURCE%/*}/${CONFIG_FILE}" "${BASH_SOURCE%/*}/../lib/config.json"
