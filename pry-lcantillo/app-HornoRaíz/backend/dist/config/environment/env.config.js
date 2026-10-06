"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV_CONFIG = void 0;
exports.loadEnvConfig = loadEnvConfig;
const dotenv_1 = __importDefault(require("dotenv"));
const env_validation_js_1 = require("./env.validation.js");
exports.ENV_CONFIG = Symbol('ENV_CONFIG');
function toBlock(prefix, raw, defaultPort) {
    return {
        host: String(raw[`DB_${prefix}_HOST`] ?? 'localhost'),
        port: Number(raw[`DB_${prefix}_PORT`] ?? defaultPort),
        username: String(raw[`DB_${prefix}_USERNAME`] ?? ''),
        password: String(raw[`DB_${prefix}_PASSWORD`] ?? ''),
        name: String(raw[`DB_${prefix}_NAME`] ?? ''),
    };
}
function loadEnvConfig() {
    dotenv_1.default.config();
    const raw = process.env;
    (0, env_validation_js_1.validateEnv)(raw);
    return {
        port: Number(raw.PORT ?? 3004),
        nodeEnv: String(raw.NODE_ENV ?? 'development'),
        dbDialect: String(raw.DB_DIALECT),
        mysql: toBlock('MYSQL', raw, 3306),
        postgres: toBlock('POSTGRES', raw, 5432),
        mssql: toBlock('MSSQL', raw, 1433),
        oracle: toBlock('ORACLE', raw, 1521),
    };
}
//# sourceMappingURL=env.config.js.map