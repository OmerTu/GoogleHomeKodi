'use strict';

const Helper = require('./helpers.js');
const path = require('path');
const fs = require('fs');

let lastUsedLanguage = ``;
let localizedPhrases = null;

const testRegexNamedGroupesFeature = () => {

    let match = false;

    try {
        match = `named group test`.match(`(?<group>test)`);
    } catch (error) {
        match = false;
    }

    if (!match) {
        throw new Error(`regex named groups test failed. You need nodejs version 10 or higher for the broker to work!`);
    }
};

const loadLanguageFile = (language) => {

    try {
        let configDirectory = '/config';

        try {
            let configFile = process.env.GOOGLE_HOME_KODI_CONFIG || './kodi-hosts.config.js';

            configDirectory = path.dirname(fs.realpathSync(configFile));
            // eslint-disable-next-line global-require
            let lang = require(`${configDirectory}/${language}.json`);
            console.log(`Found customized language file for '${language}'.`);
            return lang;
        } catch (error) {
            // NOOP
        }

        // eslint-disable-next-line global-require
        let lang = require(`${configDirectory}/${language}.json`);
        console.log(`Found customized language file for '${language}'`);
        return lang;

    } catch (error) {
        console.log(`No customized language file found for '${language}', loading default file.`);

        // eslint-disable-next-line global-require
        return require(`./broker/${language}.json`);
    }
};

const matchPhraseToEndpoint = (request) => {

    testRegexNamedGroupesFeature();

    if (request.query.phrase === undefined) {
        throw new Error(`Missing mandatory query parameter 'phrase'`);
    }

    let phrase = request.query.phrase.toLowerCase().trim();
    let language = request.query.lang || `en`;

    if (lastUsedLanguage !== language) {
        // reload lang file if language has changed
        localizedPhrases = loadLanguageFile(language);
        lastUsedLanguage = language;
    }

    console.log(`Broker processing phrase: '${phrase}' (${language})`);

    for (let key in localizedPhrases) {

        let match = phrase.match(`^${localizedPhrases[key]}`);

        if (match) {

            // copy named groups to request.query
            for (let g in match.groups) {
                if (match.groups[g]) {
                    request.query[g] = match.groups[g].trim();
                }
            }

            console.log(`redirecting request to: '${key}'`);
            return key;
        }
    }
    throw new Error(`Broker unknown phrase: '${phrase}' (${language})`);
};

exports.matchPhraseToEndpoint = matchPhraseToEndpoint;

exports.processRequest = (request, response) => {
    let endpointKey = matchPhraseToEndpoint(request, response);
    let endpoint = endpointKey.split(`:`, 1)[0];
    return Helper[endpoint](request, response);
};
