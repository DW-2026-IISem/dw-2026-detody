"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientEmailAlreadyExistsException = exports.ClientNotFoundException = void 0;
const application_exception_js_1 = require("../../../../../common/exceptions/application.exception.js");
class ClientNotFoundException extends application_exception_js_1.EntityNotFoundException {
    constructor(id) {
        super(`Cliente con id ${id} no encontrado`);
    }
}
exports.ClientNotFoundException = ClientNotFoundException;
class ClientEmailAlreadyExistsException extends application_exception_js_1.BusinessRuleException {
    constructor(email) {
        super(`Ya existe un cliente con el email ${email}`);
    }
}
exports.ClientEmailAlreadyExistsException = ClientEmailAlreadyExistsException;
//# sourceMappingURL=client.exceptions.js.map