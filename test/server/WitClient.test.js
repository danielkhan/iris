'use strict';

require('should');
const config = require('../../config');
const WitClient = require('../../server/WitClient');

describe('WitClient', () => {

    describe('ask', () => {

        it('should return a valid wit response with intent and subject when asked for the time', (done) => {
            
            const witCLient = new WitClient(config.witToken);

            witCLient.ask('What is the current time in Vienna?', (err, response) => {
                if(err) return done(err);
                response.intent[0].value.should.equal('time');
                response.location[0].value.should.equal('Vienna');
                return done();
            });
            
        });
    });
});