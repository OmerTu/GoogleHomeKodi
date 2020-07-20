'use strict'; // eslint-disable-line strict

require('dotenv').config();
const Kodi = require('./kodi-connection/node.js');

let kodiConfig = [];
let globalConfig = {};

try {
    // Try to import the kodi hosts. If not found, we'll assume that env variables are available.
    let configFile = process.env.GOOGLE_HOME_KODI_CONFIG || './kodi-hosts.config.js';
    let config = require(configFile); // eslint-disable-line global-require

    kodiConfig = config.kodiConfig;
    globalConfig = config.globalConfig;
} catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') {
        throw e;
    }
}

const checkMandatoryEnv = (variables) => {

    let missing = variables.filter((v) => !process.env[v]);

    if (missing.length > 0) {
        console.log('Missing mandatory configuration:', missing.join(', '));
        console.log(
            `Check your .env-File (when hosting with Glitch)`,
            `or your environment variables (when hosting with Docker)`,
            `or the kodi-hosts.config.js file.`
        );
        process.exit(1);
    }
};

const Init = function() {
    this.kodiHosts = [];
    this.globalConf = {};

    if (kodiConfig.length !== 0) {
        // We've found one or more kodi configurations.
        this.kodiHosts = kodiConfig.map((config) => {
            return {
                id: config.id,
                host: new Kodi(
                    config.kodiProtocol || 'http',
                    config.kodiIp,
                    config.kodiPort,
                    config.kodiUser,
                    config.kodiPassword)
            };
        });
        console.log(`Loaded ${this.kodiHosts.length} Kodi hosts.`);
    } else {
        checkMandatoryEnv(['KODI_IP', 'KODI_PORT']);

        this.kodiHosts.push({
            id: 'kodi',
            host: new Kodi(
                process.env.KODI_PROTOCOL || 'http',
                process.env.KODI_IP,
                process.env.KODI_PORT,
                process.env.KODI_USER,
                process.env.KODI_PASSWORD)
        });
    }

    if (Object.keys(globalConfig).length > 0) {
        console.log(`Loaded config from kodi-hosts.config.js, ${JSON.stringify(globalConfig, null, 2)}`);
        this.globalConf = globalConfig;
    } else {
        checkMandatoryEnv(['AUTH_TOKEN', 'PORT']);
        this.globalConf.authToken = process.env.AUTH_TOKEN;
        this.globalConf.listenerPort = process.env.PORT;
        this.globalConf.youtubeKey = process.env.YOUTUBE_KEY || 'AIzaSyBYKxhPJHYUnzYcdOAv14Gmq-43_W9_79w';
        console.log('Loaded config from .env (environment)');
    }

    this.getHost = (kodiId) => {

        if (kodiId) {
            return this.kodiHosts
                .find((kodiHost) => kodiHost.id === kodiId)
                .host;
        }

        return this.kodiHosts[0].host;
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
