module.exports = {
    apps: [
        {
            name: 'IRIS-TIME',
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
            repo: 'git@github.com:danielkhan/iris.git',
            path: '/var/srv/production',
            'post-deploy': 'cp ../.env ./ && npm install && pm2 startOrRestart ecosystem.json --env production'
        }
    }
};
