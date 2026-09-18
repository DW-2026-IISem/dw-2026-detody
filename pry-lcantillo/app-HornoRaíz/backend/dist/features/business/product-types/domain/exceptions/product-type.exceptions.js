import { BusinessRuleException, EntityNotFoundException } from '../../../../../common/exceptions/application.exception.js';
export class ProductTypeNotFoundException extends EntityNotFoundException {
    constructor(id) {
        super(`Tipo de producto con id ${id} no encontrado`);
    }
}
export class ProductTypeNameAlreadyExistsException extends BusinessRuleException {
    constructor(name) {
        super(`Ya existe un tipo de producto con el nombre "${name}"`);
    }
}
//# sourceMappingURL=product-type.exceptions.js.map