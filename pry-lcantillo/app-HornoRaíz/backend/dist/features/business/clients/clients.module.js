"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientsModule = void 0;
const common_1 = require("@nestjs/common");
const create_client_use_case_js_1 = require("./application/use-cases/create-client.use-case.js");
const get_client_by_id_use_case_js_1 = require("./application/use-cases/get-client-by-id.use-case.js");
const list_clients_use_case_js_1 = require("./application/use-cases/list-clients.use-case.js");
const client_repository_js_1 = require("./domain/interfaces/client.repository.js");
const client_repository_js_2 = require("./infrastructure/persistence/repositories/client.repository.js");
const client_seeder_js_1 = require("./infrastructure/persistence/seeders/client.seeder.js");
const clients_controller_js_1 = require("./presentation/http/controllers/clients.controller.js");
let ClientsModule = class ClientsModule {
};
exports.ClientsModule = ClientsModule;
exports.ClientsModule = ClientsModule = __decorate([
    (0, common_1.Module)({
        controllers: [clients_controller_js_1.ClientsController],
        providers: [
            create_client_use_case_js_1.CreateClientUseCase,
            list_clients_use_case_js_1.ListClientsUseCase,
            get_client_by_id_use_case_js_1.GetClientByIdUseCase,
            client_seeder_js_1.ClientSeeder,
            { provide: client_repository_js_1.CLIENT_REPOSITORY, useClass: client_repository_js_2.ClientRepository },
        ],
        exports: [client_repository_js_1.CLIENT_REPOSITORY, client_seeder_js_1.ClientSeeder],
    })
], ClientsModule);
//# sourceMappingURL=clients.module.js.map