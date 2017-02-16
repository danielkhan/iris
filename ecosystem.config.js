module.exports = {
    apps: [
        {
            name: 'IRIS',
            script: 'bin/run.js',
            env_production: {
                NODE_ENV: 'production'
            }
        }
    ],
    
    deploy: {
        production: {
            user: 'node',
            host: '34.251.16.136',
            ref: 'origin/master',
            repo: 'https://github.com/danielkhan/iris.git',
            path: '/var/srv/production',
            'post-deploy': 'cp ../.env ./ && npm install && pm2 startOrRestart ecosystem.config.js --env production'
        }
    }
};
