'use strict'; // eslint-disable-line strict

const express = require('express');
const Fuse = require('fuse.js');


// Set option for fuzzy search
const fuzzySearchOptions = (property) => {
    return {
        caseSensitive: false, // Don't care about case whenever we're searching titles by speech
        includeScore: false, // Don't need the score, the first item has the highest probability
        shouldSort: true, // Should be true, since we want result[0] to be the item with the highest probability
        threshold: 0.4, // 0 = perfect match, 1 = match all..
        location: 0,
        distance: 100,
        maxPatternLength: 64,
        keys: [property]
    };
};


const getBooleanSettings = (kodi) => {
    return kodi.Settings.GetSettings() // eslint-disable-line new-cap
        .then((response) => {
            let fuse = new Fuse(response.result.settings, fuzzySearchOptions('type'));
            let searchResults = fuse.search('boolean');

            return Promise.resolve(searchResults);
        });
};

const findQueriedSetting = (settings, needle) => {

    let fuse = new Fuse(settings, fuzzySearchOptions('label'));
    let searchResult = fuse.search(needle);

    console.log(`search for '${needle}' has ${searchResult.length} matches`);

    if (searchResult.length === 0) {
        throw new Error(`no matching setting found for '${needle}'`);
    }

    return Promise.resolve(searchResult[0]);
};

const toggleSetting = (kodi, setting) => {
    console.log('toggleing setting: ', setting);
    let currentValue = setting.value;
    let newValue = !currentValue;

    return kodi.Settings.SetSettingValue({ // eslint-disable-line new-cap
        setting: setting.id,
        value: newValue
    });
};

const enableSetting = (kodi, setting) => {
    console.log('enabling setting: ', setting);

    return kodi.Settings.SetSettingValue({ // eslint-disable-line new-cap
        setting: setting.id,
        value: true
    });
};

const disableSetting = (kodi, setting) => {
    console.log('disabling setting: ', setting);

    return kodi.Settings.SetSettingValue({ // eslint-disable-line new-cap
        setting: setting.id,
        value: false
    });
};

const toggleBooleanSetting = (request) => {
    let needle = request.query.q.trim();

    return getBooleanSettings(request.kodi)
        .then((settings) => findQueriedSetting(settings, needle))
        .then((setting) => toggleSetting(request.kodi, setting));
};

const enableBooleanSetting = (request) => {
    let needle = request.query.q.trim();

    return getBooleanSettings(request.kodi)
        .then((settings) => findQueriedSetting(settings, needle))
        .then((setting) => enableSetting(request.kodi, setting));
};

const disableBooleanSetting = (request) => {
    let needle = request.query.q.trim();

    return getBooleanSettings(request.kodi)
        .then((settings) => findQueriedSetting(settings, needle))
        .then((setting) => disableSetting(request.kodi, setting));
};

const listBooleanSettings = (request, response) => {

    return getBooleanSettings(request.kodi)
        .then((settings) => settings.map((s) => s.label))
        .then((settings) => response.json(settings));
};


exports.build = (exec) => {
    const app = express();

    app.set('json spaces', 2);

    app.all('/toggle', exec(toggleBooleanSetting));
    app.all('/enable', exec(enableBooleanSetting));
    app.all('/disable', exec(disableBooleanSetting));
    app.all('/list', exec(listBooleanSettings));

    return app;
};
