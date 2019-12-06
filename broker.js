'use strict';

const Helper = require('./helpers.js');

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
        throw new Error(
            `regex named groups test failed. ` +
            `You need nodejs version 10 or higher for the broker to work!`);
    }
};

exports.processRequest = (request, response) => {

    testRegexNamedGroupesFeature();

    let phrase = request.query.phrase.toLowerCase();
    let language = request.query.lang || `en`;

    if (lastUsedLanguage !== language) {
        // reload lang file if language has changed
        localizedPhrases = require(`./broker/${language}.json`);
        lastUsedLanguage = language;
    }

    console.log(`Broker processing phrase: '${phrase}' (${language})`);

    for (let key in localizedPhrases) {

        let match = phrase.match(`^${localizedPhrases[key]}`);

        if (match) {

            // copy named groups to request.query
            for (let g in match.groups) {
                if (match.groups[g]) {
                    request.query[g] = match.groups[g];
                }
            }

            let endpoint = key.split(`:`, 1)[0];

            // call original handler
            return Helper[endpoint](request, response);
        }
    }
    throw new Error(`Broker unknown phrase: '${phrase}' (${language})`);
};
