'use strict';

const httpMocks = require('node-mocks-http');
const broker = require('../../broker.js');
const fs = require('fs');

console.log = function() {};

const testSimplePhrase = function(request, response, expected, q, done) {
  
    let actualEndpointKey = broker.matchPhraseToEndpoint(request, response);
    try {
        let actualEndpoint = actualEndpointKey.split(`:`, 1)[0];

        actualEndpoint.should.equal(expected);

        if (q) {
            request.query.q.should.equal(q);
        }
        done();
    } catch (error) {
        console.error(actualEndpointKey);
        done(error);
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
                    it(phraseTest.phrase, function(done) {
                        this.testRequest.query.phrase = phraseTest.phrase;
                        testSimplePhrase(this.testRequest, this.testResponse, endpointTest.endpoint, phraseTest.q, done);
                    });
                });
            });
        });
    });
};

testBroker('de');
testBroker('en');
testBroker('fr');
