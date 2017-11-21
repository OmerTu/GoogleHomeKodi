'use strict'; // eslint-disable-line strict
let kodiConfig = [];
let globalConfig = {};

try {
    // Try to import the kodi hosts. If not found, we'll asume that env varialbes are available.
    let config = require('./kodi-hosts.config.js'); // eslint-disable-line global-require

    kodiConfig = config.kodiConfig;
    globalConfig = config.globalConfig;
} catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') {
        throw e;
    }
}

const Kodi = require('./kodi-connection/node.js');

const Init = function() {
    this.kodiHosts = [];
    this.globalConf = {};

    require('dotenv').load(); // eslint-disable-line global-require
    if (kodiConfig.length !== 0) {
        // We've found one or more kodi configurations.
        this.kodiHosts = kodiConfig.map((config) => {
            return {
                id: config.id,
                host: new Kodi(config.kodiIp, config.kodiPort, config.kodiUser, config.kodiPassword)
            };
        });
        console.log(`Loaded ${this.kodiHosts.length} hosts from the config.js`);
    } else {
        if (!process.env.AUTH_TOKEN || !process.env.KODI_IP || !process.env.KODI_PORT || !process.env.KODI_USER || !process.env.KODI_PASSWORD) {
            console.log('Missing kodi host config. Please configure one using the .env (when using Glitch) or the config.js file.');
            process.exit();
        }

        this.kodiHosts[0] = {
            id: 'kodi',
            host: new Kodi(process.env.KODI_IP, process.env.KODI_PORT, process.env.KODI_USER, process.env.KODI_PASSWORD)
        };
    }

    if (Object.keys(globalConfig).length > 0) {
        console.log(`Starting using kodi-hosts.config.js, ${JSON.stringify(globalConfig)}`);
        this.globalConf = globalConfig;
    } else {
        if (!process.env.AUTH_TOKEN || !process.env.PORT) {
            console.log('Missing AuthToken. Please configure one using the .env (when using Glitch) or the config.js file.');
            process.exit();
        }
        this.globalConf.authToken = process.env.AUTH_TOKEN;
        this.globalConf.listenerPort = process.env.PORT;
        this.globalConf.youtubeKey = process.env.YOUTUBE_KEY || 'AIzaSyBYKxhPJHYUnzYcdOAv14Gmq-43_W9_79w';
        console.log('Loaded config from .env');
    }

    this.getHost = (kodiId) => {
        let returnHost;

        if (kodiId) {
            returnHost = this.kodiHosts.filter((kodiHost) => {
                if (kodiHost.id === kodiId) {
                    return kodiHost.host;
                }
            })[0].host;
        } else {
            returnHost = this.kodiHosts[0].host;
        }
        return returnHost;
    };

    /*
    * Check the request to determine to which kodi instance we want to route the actions to.
    * The request object is anylyzed. And the Kodi object is attached to the request, for further use.
    */
    this.routeKodiInstance = (request) => {
        // For now we are only attaching the first host in the list.
        // Next will be to determin a way of passing a host, through IFTTT.
        request.kodi = this.getHost(request.body.kodiid);
        request.config = this.globalConf;
    };
};

module.exports = Init;
