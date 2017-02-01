'use strict';

require('should');
const config = require('../../config');
const SlackClient = require('../../server/SlackClient');

class NlpMock {

    ask(question, cb) {

        return cb(null, {
            'intent': [{ value: 'test' }]
        });

    }

}


class RegistryMock {

}

// use function() here to preserve this of mocha
describe('SlackClient', () => {

    // Connecting to slack may take some time
    // this.timeout(15000);

    it('should successfully connect to slack', (done) => {
        const slackClient = new SlackClient(config.slackToken, 'error', new NlpMock(), new RegistryMock());

        slackClient.start((slackRes) => {
            slackRes.ok.should.be.true;
            return done();
        });

    });

    it('should consult wit with an intent', (done) => {
        const slackClient = new SlackClient(config.slackToken, 'error', new NlpMock(), new RegistryMock());

        slackClient.start((slackRes) => {
            slackRes.ok.should.be.true;

            const message = {
                type: 'message',
                channel: 'C0A3J4J3W',
                user: 'U0A3JCY6N',
                text: 'whats the time in Sydney, Iris?',
                ts: '1485898835.000002',
                team: 'T0A3J9UCT'
            };

            
            slackClient._handleOnMessage(message);

            return done();
        });

    });
});

/*
const message = {
            type: 'message',
            channel: 'C0A3J4J3W',
            user: 'U0A3JCY6N',
            text: 'whats the time in Sydney, Iris?',
            ts: '1485898835.000002',
            team: 'T0A3J9UCT'
        };

        // console.log(slackClient._rtm.handleWsMessage(

            */

