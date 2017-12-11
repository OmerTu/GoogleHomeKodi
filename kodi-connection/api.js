const namespaces = require('./api-methods.js');
const ResponseException = require('../exceptions.js').ResponseException;

module.exports = (fetch) => {
    
    const addMethods = (obj) => {
        namespaces.forEach((namespace) => {
            obj[namespace.name] = namespace.methods.reduce((result, method) => {
                result[method] = (params, callback) => {
                    return obj.send(`${namespace.name}.${method}`, params, callback);
                };
                return result;
            }, {});
        });
    };

    const Kodi = function(protocol, ip, port, username, password) {
        this.kodiAuth = `Basic ${new Buffer(`${username}:${password}`).toString('base64')}`;
        this.url = `${protocol}://${ip}:${port}/jsonrpc`;
        addMethods(this);
    };

    Kodi.prototype.sendHTTP = function(body, callback) {
        console.log(`Command sent = ${body}`);
        const headers = {
            'Content-type': 'application/json',
            'Accept': 'application/json',
            'Authorization': this.kodiAuth
        };

        return fetch(this.url, {
            method: 'POST',
            body: body,
            headers: headers
        })
        .then((response) => {
            if (response.ok) {
                return response.json();
            }

            throw new ResponseException(
                `Error in response, ${response.statusText} with status code: ${response.status}`,
                response.status,
                response.statusText);
        })
        .then((data) => {
            if (callback) {
                callback(data);
            }
            return data;
        });
    };

    Kodi.prototype.send = function(method, params, callback) {
        let body = {
            jsonrpc: '2.0',
            id: 1,
            method: method
        };

        if (params) {
            body.params = params;
        }
        body = JSON.stringify(body);
        return this.sendHTTP(body, callback);
    };

    return Kodi;
};
