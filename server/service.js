'use strict';

const express = require('express');
const service = express();
const ServiceRegistry = require('./ServiceRegistry');


module.exports = (config) => {

    const log = config.log();

    const serviceRegistry = new ServiceRegistry(config.serviceTimeout, log);
    service.set('serviceRegistry', serviceRegistry);

    service.get('/', (req, res) => {
        return res.json({hello: 'world'});
    });

    service.put('/service/:intent/:port', (req, res) => {

        if(req.get('X-IRIS-API-TOKEN') !== config.irisApiToken) {
            return res.sendStatus(403);
        }
        
        if(!req.get('X-IRIS-SERVICE-TOKEN')) {
            return res.sendStatus(400);
        }

        const serviceIntent = req.params.intent;
        const servicePort = req.params.port;

        const serviceIp = req.connection.remoteAddress.includes('::')
            ? `[${req.connection.remoteAddress}]` : req.connection.remoteAddress;

        serviceRegistry.add(serviceIntent, serviceIp, servicePort, req.get('X-IRIS-SERVICE-TOKEN'));
        res.json({ result: `${serviceIntent} at ${serviceIp}:${servicePort}` });
    });

    return service;
};