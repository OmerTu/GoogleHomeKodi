
'use strict'; // eslint-disable-line strict

const Helper = require('./helpers.js');

let last_lang = "";
let lang_dictionary = null;

exports.processRequest = (request, response) => {

    let phrase = request.query.phrase;
    let lang = request.query.lang;

    if(!lang) {
        lang = "en";
    }

    if(last_lang != lang) {
        //reload lang file if language has changed
        lang_dictionary = require('./broker/' + lang + '.json')
        last_lang = lang;
    }

    console.log('Broker processing phrase ' + phrase);

    //find first match
    for(var key in lang_dictionary) {

        let result = phrase.match("^" + lang_dictionary[key]);
        if(result) {

            //copy named groups to request.query
            for(var g in result.groups) {
                if(result.groups[g]) {
                    request.query[g] = result.groups[g];
                }
            }

            //remove : suffix
            var pos = key.indexOf(':');
            key = key.substring(0, pos != -1 ? pos : key.length);
    
            //call original handler by key
            return Helper[key](request, response);
        }
        
    }
    return new Promise(() => {
        console.log('Broker unknown phrase');
        response.send("Broker: unknown phrase");
    });
};
