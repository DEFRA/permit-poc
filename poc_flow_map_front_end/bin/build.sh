#!/bin/sh

./node_modules/.bin/node-sass \
  --output-style=expanded \
  --output=public/build/stylesheets \
  src/client/sass

cp -r ./node_modules/@ministryofjustice/frontend/moj/assets public/static
mkdir -p public/static/moj && cp ./node_modules/@ministryofjustice/frontend/moj/all.js public/static/moj