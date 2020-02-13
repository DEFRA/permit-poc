# Defra Permit POC


## About

This project is a Proof of Concept (POC) that aim to explore
techniques for producing permitting applications, learning from and
improving upon previous projects
([Waste PermitsService](https://github.com/DEFRA/waste-permits)
and its equivalents across Defra).


## Requirements

* Local development requires a Docker environment (MacOS and
  Windows users should install
  [Docker Desktop](https://www.docker.com/get-started)
  The essential commands are `docker` and `docker-compose`
* The applications will run NodeJS with the HapiJS framework.
* All dependencies are contained within the Docker images

## Getting Started

Download and install a docker environment.

If using a POSIX environment run the following (from this
directory):

```sh
./bin/clean_start.sh
```

This instruction can be run any time to clean up your environments
(based on the config files you currently have).

To start the application services in _developer mode_
```sh
docker-compose up
```

If all goes to plan, the app should be visible at:
[http://localhost](http://localhost)

## Notes

### TODO:

- look at `npm ci` with package-lock and/or shrinkwrap

### Handy Commands

### Basic Docker

```sh
# build
docker build -t rudenoise/poc_front_end:latest poc_front_end/

# run a shell
docker run -ti -u=node poc_front_end /bin/sh

# shell on a running container
docker container exec -it $CONTAINER_ID /bin/sh
```

## Docker Compose

```sh
docker-compose build

# start the containers and keep output in foregroud
docker-compose up

# start up and put all in background
docker-compose up -d

# manually alter container prefix
docker-compose -p=permits_poc up

# stop running containers
docker-compose stop

# Stop and remove all containers, networks, images, and volumes:
docker-compose down --rmi all --volumes

# get a shell on running container (by service name)
docker-compose exec web /bin/sh
```


## Notes

Docker Best Practice
- https://docs.docker.com/engine/reference/builder/
- https://docs.docker.com/compose/
- https://jdlm.info/articles/2016/03/06/lessons-building-node-app-docker.html
- https://dev.to/alex_barashkov/using-docker-for-nodejs-in-development-and-production-3cgp

DNS (Mac):
- https://passingcuriosity.com/2013/dnsmasq-dev-osx/

NPM in containers:
- https://docs.npmjs.com/cli/ci.html
- https://docs.npmjs.com/configuring-npm/shrinkwrap-json.html

Process Restart:
- https://github.com/fgnass/node-dev
- https://github.com/remy/nodemon
- https://github.com/foreversd/forever

Related Projects
- https://github.com/DEFRA/hapi-govuk-question-page/blob/master/test-harness/test-harness-page.js
- https://github.com/DEFRA/hapi-govuk-question-page/blob/master/API.md
- https://github.com/ajaxscape/hapi-front-end-template/blob/master/server/modules/hello-world/hello-world.njk
- https://github.com/ajaxscape/hapi-front-end-template
- https://github.com/ministryofjustice/moj-frontend
