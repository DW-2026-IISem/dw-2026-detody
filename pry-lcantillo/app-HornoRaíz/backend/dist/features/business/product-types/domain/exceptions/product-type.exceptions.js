"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductTypeNameAlreadyExistsException = exports.ProductTypeNotFoundException = void 0;
const application_exception_js_1 = require("../../../../../common/exceptions/application.exception.js");
class ProductTypeNotFoundException extends application_exception_js_1.EntityNotFoundException {
    constructor(id) {
        super(`Tipo de producto con id ${id} no encontrado`);
    }
}
exports.ProductTypeNotFoundException = ProductTypeNotFoundException;
class ProductTypeNameAlreadyExistsException extends application_exception_js_1.BusinessRuleException {
    constructor(name) {
        super(`Ya existe un tipo de producto con el nombre "${name}"`);
    }
}
exports.ProductTypeNameAlreadyExistsException = ProductTypeNameAlreadyExistsException;
//# sourceMappingURL=product-type.exceptions.js.map