import { BusinessRuleException, EntityNotFoundException } from '../../../../../common/exceptions/application.exception.js';
export declare class SaleNotFoundException extends EntityNotFoundException {
    constructor(id: number);
}
export declare class InsufficientStockException extends BusinessRuleException {
    constructor(productName: string, available: number, requested: number);
}
export declare class EmptySaleItemsException extends BusinessRuleException {
    constructor();
}
