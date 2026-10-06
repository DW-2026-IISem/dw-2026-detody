"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductNameAlreadyExistsException = exports.ProductNotFoundException = void 0;
const application_exception_js_1 = require("../../../../../common/exceptions/application.exception.js");
class ProductNotFoundException extends application_exception_js_1.EntityNotFoundException {
    constructor(id) {
        super(`Producto con id ${id} no encontrado`);
    }
}
exports.ProductNotFoundException = ProductNotFoundException;
class ProductNameAlreadyExistsException extends application_exception_js_1.BusinessRuleException {
    constructor(name) {
        super(`Ya existe un producto registrado con el nombre "${name}"`);
    }
}
exports.ProductNameAlreadyExistsException = ProductNameAlreadyExistsException;
//# sourceMappingURL=product.exceptions.js.map