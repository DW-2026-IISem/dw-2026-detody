export declare class EnvVariables {
    DB_DIALECT: string;
    DB_MYSQL_HOST?: string;
}
export declare function validateEnv(raw: Record<string, unknown>): EnvVariables;
