/**
 * Custom response exception
 * @param {*} message Exception message.
 * @param {*} statusText Optional status text, retreived from the responses status text.
 * @param {*} status Optional status response code.
 */
function ResponseException(message, statusText, status) {
  this.message = message;
  this.name = 'ResponseException';
  this.statusText = statusText || this.message;
  this.status = status || 400;
}

module.exports = function(fetch) {
  var namespaces = require('./api-methods.js');

  function addMethods(obj) {
    namespaces.forEach(function(namespace) {
      obj[namespace.name] = namespace.methods.reduce(function(result, method) {
        result[method] = function(params, callback) {
          return obj.send(namespace.name + '.' + method, params, callback);
        };
        return result;
      }, {});
    });
  }

  function Kodi(ip, port, username, password) {
    this.kodi_auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
    this.url = 'http://' + ip + ':' + port + '/jsonrpc';
    addMethods(this);
  }

  Kodi.prototype.sendHTTP = function(body, callback) {
    console.log('Command sent = ' + body);
    var headers = {
      "Content-type": "application/json",
      'Accept': "application/json",
      'Authorization': this.kodi_auth
    };

    return fetch(this.url, {
        method: 'POST',
        body: body,
        headers: headers
      })
      .then(function (response) {
        if (response.status !== 200) {
          throw new ResponseException(`Error in response, ${response.statusText} with status code: ${response.status}`,
                                      response.statusText,
                                      response.status);
        }
        return response.json();
      })
      .then(function(data) {
        if(callback) callback(data);
        return data;
      });
  };

  Kodi.prototype.send = function(method, params, callback) {
    var body = {
      jsonrpc: "2.0",
      id: 1,
      method: method
    };

    if(params) body.params = params;
    body = JSON.stringify(body);
    return this.sendHTTP(body, callback);
  };

  return Kodi;
};