"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvironmentModule = void 0;
const common_1 = require("@nestjs/common");
const env_config_js_1 = require("./env.config.js");
let EnvironmentModule = class EnvironmentModule {
};
exports.EnvironmentModule = EnvironmentModule;
exports.EnvironmentModule = EnvironmentModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [{ provide: env_config_js_1.ENV_CONFIG, useFactory: () => (0, env_config_js_1.loadEnvConfig)() }],
        exports: [env_config_js_1.ENV_CONFIG],
    })
], EnvironmentModule);
//# sourceMappingURL=environment.module.js.map