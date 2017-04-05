"use strict";
class NError {
    constructor(_status,_message,_details) {
        this.status = _status;
        this.message = _message;
        this.details = _details;
    }
}
exports.NError = NError;
