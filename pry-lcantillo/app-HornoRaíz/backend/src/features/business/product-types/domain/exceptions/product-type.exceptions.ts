import { BusinessRuleException, EntityNotFoundException } from '../../../../../common/exceptions/application.exception.js';

export class ProductTypeNotFoundException extends EntityNotFoundException {
  constructor(id: number) {
    super(`Tipo de producto con id ${id} no encontrado`);
  }
}

export class ProductTypeNameAlreadyExistsException extends BusinessRuleException {
  constructor(name: string) {
    super(`Ya existe un tipo de producto con el nombre "${name}"`);
  }
}
