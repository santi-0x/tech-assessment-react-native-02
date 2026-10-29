#!/bin/sh
set -eu
root=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
cd "$root"
node --test check/app.test.mjs
printf '%s\n' "harbor check ok"
