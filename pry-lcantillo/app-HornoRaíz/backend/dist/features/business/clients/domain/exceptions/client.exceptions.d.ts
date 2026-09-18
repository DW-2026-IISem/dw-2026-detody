import { BusinessRuleException, EntityNotFoundException } from '../../../../../common/exceptions/application.exception.js';
export declare class ClientNotFoundException extends EntityNotFoundException {
    constructor(id: number);
}
export declare class ClientEmailAlreadyExistsException extends BusinessRuleException {
    constructor(email: string);
}
