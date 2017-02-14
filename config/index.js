require('dotenv').config();
const bunyan = require('bunyan');

const log = {
    development: bunyan.createLogger({ name: 'IRIS-development', level: 'debug' }),
    production: bunyan.createLogger({ name: 'IRIS-production', level: 'info' }),
    // We don't want to have logging output in our test output - so go for only fatal errors
    test: bunyan.createLogger({ name: 'IRIS-test', level: 'fatal' }),

};
module.exports = {
    serviceTimeout: 30,
    witToken: process.env.WIT_TOKEN,
    slackToken: process.env.SLACK_TOKEN,
    irisApiToken: process.env.IRIS_API_TOKEN,
    log: (env) => {
        if(env) return log[env];
        return log[process.env.NODE_ENV || 'development'];
    }
};