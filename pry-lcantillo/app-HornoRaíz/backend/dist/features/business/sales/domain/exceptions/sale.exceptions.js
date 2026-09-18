import { BusinessRuleException, EntityNotFoundException } from '../../../../../common/exceptions/application.exception.js';
export class SaleNotFoundException extends EntityNotFoundException {
    constructor(id) {
        super(`Venta con id ${id} no encontrada`);
    }
}
export class InsufficientStockException extends BusinessRuleException {
    constructor(productName, available, requested) {
        super(`Stock insuficiente para "${productName}". Disponible: ${available}, solicitado: ${requested}`);
    }
}
export class EmptySaleItemsException extends BusinessRuleException {
    constructor() {
        super('Una venta debe contener al menos un producto');
    }
}
//# sourceMappingURL=sale.exceptions.js.map