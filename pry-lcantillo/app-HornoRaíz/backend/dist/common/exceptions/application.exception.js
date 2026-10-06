"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityNotFoundException = exports.DomainException = exports.BusinessRuleException = exports.ApplicationException = void 0;
class ApplicationException extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
    }
}
exports.ApplicationException = ApplicationException;
class BusinessRuleException extends ApplicationException {
    constructor(message) { super(409, message); }
}
exports.BusinessRuleException = BusinessRuleException;
class DomainException extends ApplicationException {
    constructor(message) { super(400, message); }
}
exports.DomainException = DomainException;
class EntityNotFoundException extends ApplicationException {
    constructor(message = 'Entidad no encontrada') { super(404, message); }
}
exports.EntityNotFoundException = EntityNotFoundException;
//# sourceMappingURL=application.exception.js.map