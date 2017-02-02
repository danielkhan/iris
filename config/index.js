require('dotenv').config();

module.exports = {

    serviceTimeout: 30,
    witToken: process.env.WIT_TOKEN,
    slackToken: process.env.SLACK_TOKEN
}