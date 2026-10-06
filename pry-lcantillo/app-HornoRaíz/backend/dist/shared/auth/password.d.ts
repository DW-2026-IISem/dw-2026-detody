export declare function hashPassword(plain: string): Promise<string>;
export declare function comparePassword(plain: string, passwordHash: string): Promise<boolean>;
export declare function sha256Hex(value: string): string;
export declare function generateOpaqueToken(): string;
