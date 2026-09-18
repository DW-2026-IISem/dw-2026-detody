import { BusinessRuleException, EntityNotFoundException } from '../../../../../common/exceptions/application.exception.js';
export class ProductNotFoundException extends EntityNotFoundException {
    constructor(id) {
        super(`Producto con id ${id} no encontrado`);
    }
}
export class ProductNameAlreadyExistsException extends BusinessRuleException {
    constructor(name) {
        super(`Ya existe un producto registrado con el nombre "${name}"`);
    }
}
//# sourceMappingURL=product.exceptions.js.map