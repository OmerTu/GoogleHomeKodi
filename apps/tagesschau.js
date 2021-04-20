'use strict';


const playFile = (request, fileName) => {
    return request.kodi.Player.Open({ // eslint-disable-line new-cap
        item: {
            file: fileName
        },
        options: {
            resume: false
        }
    });
};


const showNotification = (request, response, message, image) => {
    let param = {
        title: 'GoogleHomeKodi',
        message: message,
        image: image
    };

    return request.kodi.GUI.ShowNotification(param); // eslint-disable-line new-cap
};


const express = require('express');
const axios = require('axios');
const xmlParser = require('fast-xml-parser');

const feedUrl = 'https://www.tagesschau.de/export/video-podcast/webxl/tagesschau_https/';

const fetchAndPlayTodaysBroadcast = async(request) => {
    let feedContent = await axios.get(feedUrl);
    let json = xmlParser.parse(feedContent.data, {
        ignoreAttributes: false
    });
    let lastestItem = json.rss.channel.item[0];
    let dayOfPublication = +lastestItem.title.split('.', 2)[0];
    let todaysDay = (new Date()).getDate();
    
    if (dayOfPublication === todaysDay) {
        return playFile(request, lastestItem.enclosure['@_url']);
    }
    
    console.log({ dayOfPublication, todaysDay, lastestItem });
    return showNotification(request, response, 'Heutige Ausgabe noch nicht online', 'error');
};

exports.build = (exec) => {
    const app = express();

    app.set('json spaces', 2);
    app.all('/playTodaysBroadcast', exec(fetchAndPlayTodaysBroadcast));

    return app;
};
