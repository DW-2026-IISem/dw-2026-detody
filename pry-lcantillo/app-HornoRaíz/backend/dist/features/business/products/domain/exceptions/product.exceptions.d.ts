import { BusinessRuleException, EntityNotFoundException } from '../../../../../common/exceptions/application.exception.js';
export declare class ProductNotFoundException extends EntityNotFoundException {
    constructor(id: number);
}
export declare class ProductNameAlreadyExistsException extends BusinessRuleException {
    constructor(name: string);
}
