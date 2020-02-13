'use strict';

const Hapi = require('@hapi/hapi');
const OS = require("os");

const init = async () => {

  const server = Hapi.server({
    port: 3000,
    host: process.env.HOST_NAME
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {

      return 'Hello World from ' + process.env.HOST_NAME + '!<br>' + JSON.stringify(process.env) + '<br>' + JSON.stringify(server.info);
    }
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

  console.log(err);
  process.exit(1);
});

init();
