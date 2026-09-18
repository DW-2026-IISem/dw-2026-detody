import { BusinessRuleException, EntityNotFoundException } from '../../../../../common/exceptions/application.exception.js';
export declare class ProductTypeNotFoundException extends EntityNotFoundException {
    constructor(id: number);
}
export declare class ProductTypeNameAlreadyExistsException extends BusinessRuleException {
    constructor(name: string);
}
