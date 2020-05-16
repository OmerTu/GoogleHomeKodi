'use strict';

const httpMocks = require('node-mocks-http');
const broker = require('../../broker.js');
const fs = require('fs');

console.log = function() {};

const testSimplePhrase = function(request, response, expected, q) {
    let actualEndpoint = broker.matchPhraseToEndpoint(request, response);

    actualEndpoint.should.equal(expected);
    
    if (q) {
        request.query.q.should.equal(q);
    }
};

const testBroker = function(language) {

    let brokerJson = fs.readFileSync(`./test/broker/${language}.json`);
    let endpointTests = JSON.parse(brokerJson);
    describe(`broker [lang=${language}]`, function() {

        beforeEach(function() {
            this.testRequest = httpMocks.createRequest({
                query: {
                    lang: language
                }
            });
            this.testResponse = httpMocks.createResponse();
        });


        endpointTests.forEach(function(endpointTest) {
            describe(endpointTest.endpoint, function() {
                endpointTest.phrases.forEach(function(phraseTest) {
                    it(phraseTest.phrase, function() {
                        this.testRequest.query.phrase = phraseTest.phrase;
                        testSimplePhrase(this.testRequest, this.testResponse, endpointTest.endpoint, phraseTest.q);
                    });
                });
            });
        });
    });
};

testBroker('de');
