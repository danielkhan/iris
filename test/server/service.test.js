'use strict';

require('should');
const request = require('supertest');
const config = require('../../config');
const service = require('../../server/service')(config);

describe('The express service', () => {
    describe('PUT /foo', () => {
        it('should return HTTP 404', (done) => {
            request(service)
                .put('/')
                .expect(404, done);
        });
    });

    describe('PUT /service/:intent/:port', () => {
        it('should return HTTP 403 if no access token was passed', (done) => {
            request(service)
                .put('/service/test/9999')
                .expect(403)
                .end((err, res) => {
                    if (err) return done(err);
                    // here we are using should to make an assertion
                    res.body.should.be.empty;
                    return done();

                });
        });
    });

    describe('PUT /service/:intent/:port', () => {
        it('should return HTTP 400 if an access token but no service token was passed', (done) => {
            request(service)
                .put('/service/test/9999')
                .set('X-IRIS-API-TOKEN', config.irisApiToken)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    // here we are using should to make an assertion
                    res.body.should.be.empty;
                    return done();

                });
        });
    });

    describe('PUT /service/:intent/:port', () => {
        it('should return HTTP 200 with a valid result', (done) => {
            request(service)
                .put('/service/test/9999')
                .set('X-IRIS-SERVICE-TOKEN', 'something')
                .set('X-IRIS-API-TOKEN', config.irisApiToken)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    // here we are using should to make an assertion
                    res.body.result.should.startWith('test at');
                    return done();

                });
        });
    });

});