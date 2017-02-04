'use strict';

const should = require('should');
const config = require('../../config');
const log = config.log('test');
const ServiceRegistry = require('../../server/ServiceRegistry');

describe('ServiceRegistry', () => {

    describe('new', () => {
        it('should accept a timeout being passed in', () => {
            const serviceRegistry = new ServiceRegistry(42, log);
            serviceRegistry._timeout.should.equal(42);
        });
        it('should default to 30 with no passed timeout', () => {
            const serviceRegistry = new ServiceRegistry(null, log);
            serviceRegistry._timeout.should.equal(30);
        });
    });

    describe('add / get', () => {
        it('should add a new intent to the registry and provide it via get', () => {
            const serviceRegistry = new ServiceRegistry(null, log);
            // add(intent, ip, port)
            serviceRegistry.add('test', '127.0.0.1', 9999);

            const testIntent = serviceRegistry.get('test');
            testIntent.intent.should.equal('test');
            testIntent.ip.should.equal('127.0.0.1');
            testIntent.port.should.equal(9999);
        });

        it('should update a service if it is added again', () => {
            const serviceRegistry = new ServiceRegistry(null, log);
            // add(intent, ip, port)
            serviceRegistry.add('test', '127.0.0.1', 9999);
            const testIntent1 = serviceRegistry.get('test');

            serviceRegistry.add('test', '127.0.0.1', 9999);
            const testIntent2 = serviceRegistry.get('test');

            Object.keys(serviceRegistry._services).length.should.equal(1);
            testIntent2.timestamp.should.be.greaterThanOrEqual(testIntent1.timestamp);
        });

    });

    describe('remove', () => {
        it('should remove an intent from the registry', () => {
            const serviceRegistry = new ServiceRegistry(null, log);
            // add(intent, ip, port)
            serviceRegistry.add('test', '127.0.0.1', 9999);

            const testIntent = serviceRegistry.get('test');
            testIntent.intent.should.equal('test');

            serviceRegistry.remove('test', '127.0.0.1', 9999);
            const nullIntent = serviceRegistry.get('test');

            // To make this kind of syntax work we now have to define should.
            // Remember - we didn't because eslint would mark it as unused otherwise.
            should.not.exist(nullIntent);

        });
    });

    describe('_cleanup', () => {
        it('should remove expired services', () => {
            // Now the fact that we can pass in the timeout greatly helps
            // Using -1 guarantees that the each service will be xpired right away.
            const serviceRegistry = new ServiceRegistry(-1, log);     
            serviceRegistry.add('test', '127.0.0.1', 9999);
            const nullIntent = serviceRegistry.get('test');
            should.not.exist(nullIntent);

        });
    });

});