# Defra Permit POC

## Contents

- [About](#about)
- [Requirements](#requirements)
- [Getting Started](#getting-started)
- [Technical Notes](./docs/technical/)
  - Notes on how to build, run and modify the apps in this project.
  - Technical topics to return to.
  - Food for thought
  - Reference
- [Topics Discussed and Loose Decision Log](./docs/topics/)

## About

This project is a Proof of Concept (POC) that aim to explore
techniques for producing permitting applications, learning from and
improving upon previous projects
([Waste PermitsService](https://github.com/DEFRA/waste-permits)
and its equivalents across Defra).



## Requirements

To run the applications in this POC:

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



