#!/bin/sh

set -euo pipefail

# build, ensuring all layers are removed first, "nuclear" option
# that removes all the efficiancies of caching layers
docker build --no-cache -t poc_front_end poc_front_end/

# copy the node files so that they can be added to version control
docker run -i poc_front_end /bin/cat /home/node/package.json > ./poc_front_end/package.json
docker run -i poc_front_end /bin/cat /home/node/npm-shrinkwrap.json > ./poc_front_end/npm-shrinkwrap.json

# do the same fot the docker-compose env
docker-compose down --rmi all --volumes --remove-orphans
docker-compose build
