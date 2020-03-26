#!/bin/sh

set -euo pipefail

nodemon -e js,html,yml,yaml,njk src/app.js -- watch $HOME/src/app 

