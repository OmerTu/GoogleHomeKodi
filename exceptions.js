/**
 * Custom response exception
 * @param {*} message Exception message.
 * @param {*} status Optional status response code.
 * @param {*} statusText Optional status text, retreived from the responses status text.
 */
module.exports.ResponseException = class ResponseException {
    constructor(message, status, statusText) {
        this.message = message;
        this.name = 'ResponseException';
        this.status = status || 400;
        this.statusText = statusText || this.message;
    }

    display() {
        console.log(`${this.message} (${this.status})`);
    }
};
