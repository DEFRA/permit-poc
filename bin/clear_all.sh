#!/bin/sh

set -euo pipefail

# https://www.digitalocean.com/community/tutorials/how-to-remove-docker-images-containers-and-volumes

docker-compose kill
docker system prune -a
docker volume prune
