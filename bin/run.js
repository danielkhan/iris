'use strict';

const config = require('../config');
const service = require('../server/service')(config);

const http = require('http');
const server = http.createServer(service);

const SlackClient = require('../server/SlackClient');

const witToken = config.witToken;
const WitClient = require('../server/WitClient');
const witClient = new WitClient(witToken);

const slackToken = config.slackToken;
const slackLogLevel = 'verbose';

const serviceRegistry = service.get('serviceRegistry');

const slackClient = new SlackClient(slackToken, slackLogLevel, witClient, serviceRegistry);
slackClient.start(() => { 
    server.listen(3000);
});

server.on('listening', function() {
    console.log(`IRIS is listening on ${server.address().port} in ${service.get('env')} mode.`);
});