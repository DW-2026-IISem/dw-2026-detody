"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALL_MODELS = void 0;
exports.sequelizeFactory = sequelizeFactory;
const sequelize_typescript_1 = require("sequelize-typescript");
const index_js_1 = require("../../../config/environment/index.js");
const client_model_js_1 = require("../../../features/business/clients/infrastructure/persistence/models/client.model.js");
const product_type_model_js_1 = require("../../../features/business/product-types/infrastructure/persistence/models/product-type.model.js");
const product_model_js_1 = require("../../../features/business/products/infrastructure/persistence/models/product.model.js");
const sale_model_js_1 = require("../../../features/business/sales/infrastructure/persistence/models/sale.model.js");
const sale_item_model_js_1 = require("../../../features/business/sales/infrastructure/persistence/models/sale-item.model.js");
exports.ALL_MODELS = [client_model_js_1.ClientModel, product_type_model_js_1.ProductTypeModel, product_model_js_1.ProductModel, sale_model_js_1.SaleModel, sale_item_model_js_1.SaleItemModel];
function sequelizeFactory(cfg) {
    const block = (0, index_js_1.getDbBlock)(cfg);
    return new sequelize_typescript_1.Sequelize({
        dialect: cfg.dbDialect,
        host: block.host,
        port: block.port,
        username: block.username,
        password: block.password,
        database: block.name,
        models: exports.ALL_MODELS,
        logging: false,
    });
}
//# sourceMappingURL=sequelize.factory.js.map