gpg --quiet --batch --yes --decrypt --passphrase="${CONFIG_DECRYPT_PASSPHRASE}" --output "${BASH_SOURCE%/*}/config.json" "${BASH_SOURCE%/*}/config.json.gpg"
gpg --quiet --batch --yes --decrypt --passphrase="${CONFIG_DECRYPT_PASSPHRASE}" --output "${BASH_SOURCE%/*}/config-staging.json" "${BASH_SOURCE%/*}/config-staging.json.gpg"
