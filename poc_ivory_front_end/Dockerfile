FROM node:13.8.0-alpine3.11

# basic setup (ensure package managers are updated
# and clear cache
RUN set -euo pipefail \
  && apk update && apk upgrade \
  && rm -fR /var/cache/apk/* \
  && apk add --no-cache git

# copy contents of application dir to the container
COPY ./package.json /home/node/
COPY ./npm-shrinkwrap.json /home/node/
COPY ./bin/run.sh /home/node/bin/run.sh
COPY ./bin/build.sh /home/node/bin/build.sh
COPY ./src /home/node/src

WORKDIR /home/node/

RUN npm i --unsafe-perm --production && npm shrinkwrap

EXPOSE 3000

# ensure build script is executable
RUN chmod +x bin/build.sh

# run build script for css etc
RUN /home/node/bin/build.sh

# ensure start script is executable
RUN chmod +x bin/run.sh

# ensure running as non-root user
# no more file modification beyond this point
USER node

# make the server/env start by default
CMD ["/home/node/bin/run.sh"]
