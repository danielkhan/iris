'use strict';

require('should');
const config = require('../../config');
const log = config.log('test');
const SlackClient = require('../../server/SlackClient');


// use function() here to preserve this of mocha
describe('SlackClient', () => {

    // Connecting to slack may take some time
    // this.timeout(15000);

    it('should successfully connect to slack', (done) => {
        const slackClient = new SlackClient(config.slackToken, 'error', null, null, log);

        slackClient.start((slackRes) => {
            slackRes.ok.should.be.true;
            return done();
        });

    });

});