FROM node:13.8.0-alpine3.11

# basic setup (ensure package managers are updated
# and clear cache
RUN set -euo pipefail \
  && apk update && apk upgrade \
  && rm -fR /var/cache/apk/*

# copy contents of application dir to the container
COPY ./package.json /home/node/
COPY ./npm-shrinkwrap.json /home/node/
COPY ./bin/run.sh /home/node/bin/run.sh
COPY ./src /home/node/src

WORKDIR /home/node/

RUN npm i --production && npm shrinkwrap

EXPOSE 3000

# ensure start script is executable
RUN chmod +x bin/run.sh


# ensure running as non-root user
# no more file modification beyond this point
USER node


# make the server/env start by default
CMD ["/home/node/bin/run.sh"]
