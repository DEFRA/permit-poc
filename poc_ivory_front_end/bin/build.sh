#!/bin/sh

./node_modules/.bin/node-sass \
  --output-style=expanded \
  --output=public/build/stylesheets \
  src/client/sass