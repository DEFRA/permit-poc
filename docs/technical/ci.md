# Continuous Integration (CI)

As this POC may not be deployed to a cloud environment, just yet,
we will duplicate the basic structure using GNU `make` and a
`Makefile`.

Basic options for building have been created, below, it will be
expanded to include:

- unit testing
- integration testing
- (possibly) automated user testing


Usage:
```sh
# from clean git checkout: build everyting
make

# rebuild a complete version of the poc_front_end container
make poc_front_end_build_clean_prod

# rebuild the idm_mock container
make idm_build_clean_prod

# start services using docker-compose in dev mode
make start_dev

# start services using docker-compose in production mode
make start_prod_mode

# wipe the entire docker environment (whole machine
make wipe

# validate and send a message to Azure blob storage
make run_date_transfer_container

# rebuild clean
make clean
```
