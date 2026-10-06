"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SequelizeModule = exports.SEQUELIZE = void 0;
const common_1 = require("@nestjs/common");
const index_js_1 = require("../../../config/environment/index.js");
const sequelize_factory_js_1 = require("./sequelize.factory.js");
exports.SEQUELIZE = 'SEQUELIZE';
let SequelizeModule = class SequelizeModule {
};
exports.SequelizeModule = SequelizeModule;
exports.SequelizeModule = SequelizeModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [
            {
                provide: exports.SEQUELIZE,
                inject: [index_js_1.ENV_CONFIG],
                useFactory: async (cfg) => {
                    const sequelize = (0, sequelize_factory_js_1.sequelizeFactory)(cfg);
                    await sequelize.authenticate();
                    await sequelize.sync({ alter: false });
                    return sequelize;
                },
            },
        ],
        exports: [exports.SEQUELIZE],
    })
], SequelizeModule);
//# sourceMappingURL=sequelize.module.js.map