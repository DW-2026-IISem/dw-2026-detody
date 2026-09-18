export class ApplicationException extends Error {
    statusCode;
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
    }
}
export class BusinessRuleException extends ApplicationException {
    constructor(message) { super(409, message); }
}
export class DomainException extends ApplicationException {
    constructor(message) { super(400, message); }
}
export class EntityNotFoundException extends ApplicationException {
    constructor(message = 'Entidad no encontrada') { super(404, message); }
}
//# sourceMappingURL=application.exception.js.map