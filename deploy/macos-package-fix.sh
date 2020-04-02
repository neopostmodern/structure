#!/bin/bash
cd "${BASH_SOURCE%/*}/../release/mac" || exit 1
version=$(sed -nE 's/^\s*"version": "(.*?)",$/\1/p' "../../package.json")
tar czpf "../structure-${version}-mac.tar.gz" Structure.app/
