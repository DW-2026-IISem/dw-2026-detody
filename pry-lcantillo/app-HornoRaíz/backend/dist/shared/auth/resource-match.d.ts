export declare function normalizePath(path: string): string;
export declare function pathMatches(pattern: string, path: string): boolean;
export declare function isOperationGranted(granted: ReadonlyArray<{
    method: string;
    path: string;
}>, method: string, path: string): boolean;
