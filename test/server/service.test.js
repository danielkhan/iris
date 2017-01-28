'use strict';

const should = require('should');
const request = require('supertest');
const service = require('../../server/service');

describe('The express service', () => {
  describe('PUT /foo', () => {
    it('should return HTTP 400', (done) => {
      request(service)
        .put('/')
        .expect(404, done);
    });
  });

  describe('PUT /service/:intent/:port', () => {
    it('should return HTTP 200 with a valid result', (done) => {
      request(service)
        .put('/service/test/9999')
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