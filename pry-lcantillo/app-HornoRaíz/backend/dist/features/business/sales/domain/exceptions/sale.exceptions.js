"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmptySaleItemsException = exports.InsufficientStockException = exports.SaleNotFoundException = void 0;
const application_exception_js_1 = require("../../../../../common/exceptions/application.exception.js");
class SaleNotFoundException extends application_exception_js_1.EntityNotFoundException {
    constructor(id) {
        super(`Venta con id ${id} no encontrada`);
    }
}
exports.SaleNotFoundException = SaleNotFoundException;
class InsufficientStockException extends application_exception_js_1.BusinessRuleException {
    constructor(productName, available, requested) {
        super(`Stock insuficiente para "${productName}". Disponible: ${available}, solicitado: ${requested}`);
    }
}
exports.InsufficientStockException = InsufficientStockException;
class EmptySaleItemsException extends application_exception_js_1.BusinessRuleException {
    constructor() {
        super('Una venta debe contener al menos un producto');
    }
}
exports.EmptySaleItemsException = EmptySaleItemsException;
//# sourceMappingURL=sale.exceptions.js.map