export class ApplicationException extends Error {
  constructor(public readonly statusCode: number, message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class BusinessRuleException extends ApplicationException {
  constructor(message: string) { super(409, message); }
}

export class DomainException extends ApplicationException {
  constructor(message: string) { super(400, message); }
}

export class EntityNotFoundException extends ApplicationException {
  constructor(message = 'Entidad no encontrada') { super(404, message); }
}
