# Technical Notes

## Contents

- [Build, Run, Modify](build-run-modify)
  Notes on how to build, run and modify the apps in this project.
  - [Doocker](docker)
  - [Docker Compose](docker-compose)
- [Continuous Integration](./ci.md)
- [Coupling](./coupling.md)
- [To Do](to-do)
  Technical topics to return to, shortcuts taken, things we didn't
  have time for.
- [Food for thought](food-for-thought)
  Other _stuff_!
- [Reference](#reference)

## Build, Run, Modify

Notes on how to build, run and modify the apps in this project.

### Basic Docker

```sh
# build
docker build -t rudenoise/poc_front_end:latest poc_front_end/

# run a shell
docker run -ti -u=node poc_front_end /bin/sh

# shell on a running container
docker container exec -it $CONTAINER_ID /bin/sh
```

### Docker Compose

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

## To Do

- look at `npm ci` with package-lock and/or shrinkwrap
- ideal nodeJS start up inside containers on different platforms
  (EKS, Fargate, K8s etc...)

## Food for thought

Hmm?

## Reference

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

JSON Schema

To be used to transfer data between NodeJS and MS Dynamics
applications, could also be used to structure UI components/screens
and application flow.

- https://json-schema.org/specification.html
- https://www.npmjs.com/package/joi-to-json-schema
- https://gds.blog.gov.uk/2019/12/19/making-gov-uk-more-than-a-website/
  A round up of accessibility enhancements with JSON schema from GDS

UI Components with JSON Schema

- https://www.baeldung.com/introduction-to-jsonforms
- https://github.com/rjsf-team/react-jsonschema-form
- https://github.com/jsonform/jsonform
- https://gcanti.github.io/resources/json-schema-to-tcomb/playground/playground.html
- https://github.com/mozilla/nunjucks/issues/1219

Related Projects
- https://github.com/DEFRA/hapi-govuk-question-page/blob/master/test-harness/test-harness-page.js
- https://github.com/DEFRA/hapi-govuk-question-page/blob/master/API.md
- https://github.com/ajaxscape/hapi-front-end-template/blob/master/server/modules/hello-world/hello-world.njk
- https://github.com/ajaxscape/hapi-front-end-template
- https://github.com/ministryofjustice/moj-frontend
