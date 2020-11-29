gpg --quiet --batch --yes --decrypt --passphrase="${CONFIG_DECRYPT_PASSPHRASE}" --output "${BASH_SOURCE%/*}/../lib/config.json" "${BASH_SOURCE%/*}/${CONFIG_FILE}.gpg"
