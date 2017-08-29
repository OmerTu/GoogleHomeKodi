'use strict'; // eslint-disable-line strict
const Kodi = require('./kodi-connection/node.js');

const globalConfig = {
    // YOUR_CONNECTION_PASSWORD
    authToken: 'MyAuthTokenSharedWith_IFTTT_Applet',
    // YOUR_LOCAL_LISTENING_PORT
    listenerPort: '8099'
};

const kodiConfig = [{
    id: 'kodi', // For now leave the first set to kodi.
    // YOUR_EXTERNAL_IP_ADDRESS
    kodiIp: '192.168.1.17',
    // YOUR_KODI_PORT
    kodiPort: '8080',
    // YOUR_KODI_USER_NAME
    kodiUser: 'kodi',
    // YOUR_KODI_PASSWORD
    kodiPassword: 'myKodiPass'
}
    // You can use this to specify additonal kodi installation, that you'd like to control.
    // ,{id: 'bedroom',
    // // YOUR_EXTERNAL_IP_ADDRESS
    // kodiIp: '192.168.1.18',
    // // YOUR_KODI_PORT
    // kodiPort: '8080',
    // // YOUR_KODI_USER_NAME
    // kodiUser: 'kodi',
    // // YOUR_KODI_PASSWORD
    // kodiPassword: ''}
];

const Init = function() {
    this.kodiHosts = [];
    this.global = {};

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
        if (!authToken || !process.env.KODI_IP || !process.env.KODI_PORT || !process.env.KODI_USER || !process.env.KODI_PASSWORD) {
            console.log('Missing kodi host config. Please configure one using the .env (when using Glitch) or the config.js file.');
            process.exit();
        }

        this.kodiHosts[0] = {
            id: 'kodi',
            host: new Kodi(process.env.KODI_IP, process.env.KODI_PORT, process.env.KODI_USER, process.env.KODI_PASSWORD)
        };
    }

    if (globalConfig) {
        this.global.authToken = globalConfig.authToken;
        this.global.listenerPort = globalConfig.listenerPort;
    } else {
        if (!process.env.AUTH_TOKEN || !process.env.PORT) {
            console.log('Missing AuthToken. Please configure one using the .env (when using Glitch) or the config.js file.');
            process.exit();
        }
        this.global.authToken = process.env.AUTH_TOKEN;
        this.global.listenerPort = process.env.PORT;
    }

    this.getHost = (kodiId) => {
        let returnHost;

        if (kodiId) {
            returnHost = this.kodiHosts.map((kodiHost) => {
                if (kodiHost.id === kodiId) {
                    return kodiHost.host;
                }
            })[0];
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
        request.kodi = this.getHost();
    };
 
    console.log('Loaded config from config.js');
};

module.exports = Init;
