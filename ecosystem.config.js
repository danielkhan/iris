module.exports = {
    /**
     * Application configuration section
     * http://pm2.keymetrics.io/docs/usage/application-declaration/
     */

    apps: [

        // First application
        {
            name: 'IRIS-TIME',
            script: 'bin/run.js',
            env: {
                COMMON_VARIABLE: 'true'
            },
            env_production: {
                NODE_ENV: 'production'
            }
        }
    ],

    /**
     * Deployment section
     * http://pm2.keymetrics.io/docs/usage/deployment/
     */
    deploy: {
        production: {
            user: 'node',
            host: '34.251.16.136',
            ref: 'origin/master',
            repo: 'https://github.com/lynda-danielkhan/iris.git',
            path: '/var/srv/production',
            'post-deploy': 'cp ../.env ./ && npm install && pm2 startOrRestart ecosystem.json --env production'
        }
    }
};
