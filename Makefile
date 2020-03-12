# Usage:
# # make        			# build all docker components
# # make clean  			# clear all docker components and rebuild from scratch
# # make build_clean	# rebuild all containers (bust cache) and update node dependencies
# # make start_dev		# start docker-compose in development mode
# # make start_prod		# start docker-compose in a mode simialr to production (minimal containers)

all: say_hello build_clean start_dev

clean: wipe build_clean

say_hello:
	@echo "let's build the POC"

build_clean: build_clean_prod_poc_front_end build_clean_prod_idm build_clean_data_transfer build_clean_prod_poc_ivory_front_end build_clean_prod_poc_flow_map_front_end

build_clean_prod_poc_front_end:
	docker build --no-cache -t poc_front_end:latest poc_front_end/
	docker run -i poc_front_end /bin/cat /home/node/package.json > ./poc_front_end/package.json
	docker run -i poc_front_end /bin/cat /home/node/npm-shrinkwrap.json > ./poc_front_end/npm-shrinkwrap.json

build_clean_prod_idm:
	docker build -t idm_mock:latest ./idm_mock
	docker run -i idm_mock /bin/cat /home/node/package.json > ./idm_mock/package.json
	docker run -i idm_mock /bin/cat /home/node/npm-shrinkwrap.json > ./idm_mock/npm-shrinkwrap.json

build_clean_data_transfer:
	docker build --no-cache -t data_transfer:latest data_transfer/
	docker run -i data_transfer /bin/cat /home/node/package.json > ./data_transfer/package.json
	docker run -i data_transfer /bin/cat /home/node/npm-shrinkwrap.json > ./data_transfer/npm-shrinkwrap.json

build_clean_prod_poc_ivory_front_end:
	docker build --no-cache -t poc_ivory_front_end:latest poc_ivory_front_end/
	docker run -i poc_ivory_front_end /bin/cat /home/node/package.json > ./poc_ivory_front_end/package.json
	docker run -i poc_ivory_front_end /bin/cat /home/node/npm-shrinkwrap.json > ./poc_ivory_front_end/npm-shrinkwrap.json

build_clean_prod_poc_flow_map_front_end:
	docker build --no-cache -t poc_flow_map_front_end:latest poc_flow_map_front_end/
	docker run -i poc_flow_map_front_end /bin/cat /home/node/package.json > ./poc_flow_map_front_end/package.json
	docker run -i poc_flow_map_front_end /bin/cat /home/node/npm-shrinkwrap.json > ./poc_flow_map_front_end/npm-shrinkwrap.json

run_data_transfer_container:
	docker run \
		--env-file ./data_transfer/.env \
		-v ${PWD}/data_transfer/src:/home/node/src \
		data_transfer

start_dev:
	docker-compose up

start_prod:
	docker-compose -f ./docker-compose-like-prod.yml up

wipe:
	./bin/clear_all.sh
