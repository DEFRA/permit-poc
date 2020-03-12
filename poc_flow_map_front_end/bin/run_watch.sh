#!/bin/sh

set -euo pipefail

nodemon -- watch $HOME/src/app -e js,html,yml,yaml,njk src/app.js

