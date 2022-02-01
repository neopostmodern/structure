gpg --symmetric --cipher-algo AES256 "${BASH_SOURCE%/*}/config-prod.json"
gpg --symmetric --cipher-algo AES256 "${BASH_SOURCE%/*}/config-staging.json"
