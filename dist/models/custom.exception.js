"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CodedError extends Error {
    constructor(code, message) {
        super(message);
        this.code = code;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = CodedError;
