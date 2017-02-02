'use strict';

const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;


// Remove
// let rtm = null;
// let nlp = null;
// let registry = null;

class SlackClient {

    // The constructor gets what we previously passed into the init function
    constructor(token, logLevel, nlp, registry, log) {

        // Store the different dependencies as properties
        this._rtm = new RtmClient(token, { logLevel: logLevel });
        this._nlp = nlp;
        this._log = log;
        this._registry = registry;

        this._addAuthenticatedHandler(this._handleOnAuthenticated);

        // We have to use bind here - otherwise this will point to the rtm client because it's called within its context
        this._rtm.on(RTM_EVENTS.MESSAGE, this._handleOnMessage.bind(this));

        // move functions into class
        // Search and replace members
    }

    _handleOnAuthenticated(rtmStartData) {
        this._log.info(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
    }

    _handleOnMessage(message) {

        if (message.text.toLowerCase().includes('iris')) {

            this._nlp.ask(message.text, (err, res) => {
                if (err) {
                    this._log.info(err);
                    return;
                }

                try {
                    if (!res.intent || !res.intent[0] || !res.intent[0].value) {
                        throw new Error('Could not extract intent.');
                    }

                    const intent = require('./intents/' + res.intent[0].value + 'Intent');

                    // Change to fat arrow because this is otherwise the function
                    intent.process(res, this._registry, this._logger, (error, response) => {
                        if (error) {
                            this._log.info(error.message);
                            return;
                        }

                        return this._rtm.sendMessage(response, message.channel);
                    });

                } catch (err) {
                    this._log.info(err);
                    this._log.info(res);
                    this._rtm.sendMessage('Sorry, I don\'t know what you are talking about!', message.channel);
                }

            });
        }
    }

    // Now we can omit passing in rtm
    _addAuthenticatedHandler(handler) {
        this._rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, handler.bind(this));
    }

    start(handler) {

        this._addAuthenticatedHandler(handler);
        this._rtm.start();
    }

}

module.exports = SlackClient;


