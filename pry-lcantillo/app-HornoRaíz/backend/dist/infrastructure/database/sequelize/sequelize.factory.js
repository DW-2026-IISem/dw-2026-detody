import { Sequelize } from 'sequelize-typescript';
import { getDbBlock } from '../../../config/environment/index.js';
export const ALL_MODELS = [];
export function sequelizeFactory(cfg) {
    const block = getDbBlock(cfg);
    return new Sequelize({
        dialect: cfg.dbDialect,
        host: block.host,
        port: block.port,
        username: block.username,
        password: block.password,
        database: block.name,
        models: ALL_MODELS,
        logging: false,
    });
}
//# sourceMappingURL=sequelize.factory.js.map