#!/bin/sh

set -euo pipefail

nodemon --watch $HOME/src/ --watch $HOME/test/ -x lab

