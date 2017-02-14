'use strict';

class ServiceRegistry {


    constructor(timeout, log) {
        this._services = [];
        this._timeout = timeout ? timeout : 30;
        this._log = log;
    }

    add(intent, ip, port, accessToken) {

        // we also want to add the access token to the key because if it changes, 
        // this would mean that we have to register it as new service.
        const key = intent + ip + port + accessToken;
        if (!this._services[key]) {
            this._services[key] = {};
            this._services[key].timestamp = Math.floor(new Date() / 1000);
            this._services[key].ip = ip;

            // Now we add accessToken to the newly registered service
            this._services[key].accessToken = accessToken;
            this._services[key].port = port;
            this._services[key].intent = intent;
    
            this._log.info(`Added service for intent ${intent} on ${ip}:${port}`);
            this._cleanup();
            return;
        }

        this._services[key].timestamp = Math.floor(new Date() / 1000);
        this._log.info(`Updated service for intent ${intent} on ${ip}:${port}`);
        this._cleanup();
    }

    remove(intent, ip, port, accessToken) {
        const key = intent + ip + port + accessToken;
        delete this._services[key];
    }

    get(intent) {
        this._cleanup();
        for (let key in this._services) {
            if (this._services[key].intent == intent) return this._services[key];
        }
        return null;
    }

    _cleanup() {
        const now = Math.floor(new Date() / 1000);

        for (let key in this._services) {
            if (this._services[key].timestamp + this._timeout < now) {
                this._log.info(`Removed service for intent ${this._services[key].intent}`);
                delete this._services[key];
            }
        }
    }

}

module.exports = ServiceRegistry;

