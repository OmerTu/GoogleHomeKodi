'use strict';

const Helper = require('./helpers.js');
const path = require('path');
const fs = require('fs');
const accents = require('remove-accents');

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
    // Replace multiple space with single space.
    phrase = phrase.replace(/\s\s+/g, ' ');

    if (request.config?.brokerAccentInsensitiveMatch) {
        phrase = accents.remove(phrase);
    }

    let language = request.query.lang || `en`;

    if (request.config?.brokerLanguageCacheEnable === false || lastUsedLanguage !== language) {
        // reload lang file if caching is disabled or language has changed
        localizedPhrases = loadLanguageFile(language);
    }

    lastUsedLanguage = language;

    console.log(`Broker processing phrase: '${phrase}' (${language})`);

    for (let key in localizedPhrases) {

        let localizedPhrase = localizedPhrases[key];

        if (request.config?.brokerAccentInsensitiveMatch) {
            localizedPhrase = accents.remove(localizedPhrase);
        }

        let match = phrase.match(`^${localizedPhrase}`);

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

    let legacyRoute = Helper[endpoint];
    if (legacyRoute) {
        return Helper[endpoint](request, response);
    }

    request.url = `/${endpoint}`;
    return Promise.resolve(request.app.handle(request, response));
};
