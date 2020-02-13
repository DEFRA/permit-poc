FROM poc_front_end

# swtich to root so that we can modify the environment (not
# suitable for production)
USER root

# add the files and dirs specific to dev and test mode
COPY ./run_watch.sh /home/node
COPY ./run_watch_tests.sh /home/node
COPY ./tests /home/node/tests

# ensure all can run and install dev dependencies too
RUN npm i -g nodemon \
    && npm i \
    && chmod +x run_watch.sh \
    && chmod +x run_watch_tests.sh

# switch back to node use, remain consistent with user privilages
# from production as far as possible
USER node

# run with a live-reload process that watches for changes in the
# filesystem (for use with docker-compose mounting of host dir)
CMD ["/home/node/run_watch.sh"]
