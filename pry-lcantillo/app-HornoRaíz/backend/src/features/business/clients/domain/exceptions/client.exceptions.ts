import { BusinessRuleException, EntityNotFoundException } from '../../../../../common/exceptions/application.exception.js';

export class ClientNotFoundException extends EntityNotFoundException {
  constructor(id: number) {
    super(`Cliente con id ${id} no encontrado`);
  }
}

export class ClientEmailAlreadyExistsException extends BusinessRuleException {
  constructor(email: string) {
    super(`Ya existe un cliente con el email ${email}`);
  }
}
