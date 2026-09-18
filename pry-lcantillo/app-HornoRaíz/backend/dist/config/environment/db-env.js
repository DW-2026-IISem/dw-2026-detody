export function getDbBlock(cfg) {
    switch (cfg.dbDialect) {
        case 'mysql': return cfg.mysql;
        case 'postgres': return cfg.postgres;
        case 'mssql': return cfg.mssql;
        case 'oracle': return cfg.oracle;
        default:
            throw new Error(`Dialecto no soportado: ${String(cfg.dbDialect)}`);
    }
}
//# sourceMappingURL=db-env.js.map