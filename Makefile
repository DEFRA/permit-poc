# Usage:
# # make        # build all docker components
# # make clean  # clear all docker components and rebuild from scratch


all: say_hello clean_build start_dev_mode

clean: wipe say_hello clean_build

say_hello:
	@echo "let's build the POC"

clean_build:
	@echo "and gnerate"
	./bin/clean_start.sh

poc_front_end_build_clean_prod:
	docker build --no-cache -t poc_front_end:latest poc_front_end/
	docker run -i poc_front_end /bin/cat /home/node/package.json > ./poc_front_end/package.json
	docker run -i poc_front_end /bin/cat /home/node/npm-shrinkwrap.json > ./poc_front_end/npm-shrinkwrap.json

idm_build_clean_prod:
	docker build -t idm_mock:latest ./idm_mock 

start_dev:
	docker-compose up

start_dev_mode:
	docker-compose up

start_prod_mode:
	docker-compose -f ./docker-compose-like-prod.yml up

wipe:
	./bin/clear_all.sh
