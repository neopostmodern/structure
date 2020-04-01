gpg --symmetric --cipher-algo AES256 "${BASH_SOURCE%/*}/config.json"
gpg --symmetric --cipher-algo AES256 "${BASH_SOURCE%/*}/config-staging.json"
