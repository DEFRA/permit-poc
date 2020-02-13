#!/bin/sh

set -euo pipefail

nodemon -- watch src/app -e js,html src/app.js

