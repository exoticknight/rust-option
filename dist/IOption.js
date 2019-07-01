"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NoneError extends Error {
    constructor() {
        super();
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, NoneError.prototype);
    }
}
exports.NoneError = NoneError;
//# sourceMappingURL=IOption.js.map