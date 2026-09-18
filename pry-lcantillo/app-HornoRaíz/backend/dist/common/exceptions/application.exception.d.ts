export declare class ApplicationException extends Error {
    readonly statusCode: number;
    constructor(statusCode: number, message: string);
}
export declare class BusinessRuleException extends ApplicationException {
    constructor(message: string);
}
export declare class DomainException extends ApplicationException {
    constructor(message: string);
}
export declare class EntityNotFoundException extends ApplicationException {
    constructor(message?: string);
}
