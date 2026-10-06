"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientMapper = void 0;
const client_entity_js_1 = require("../../domain/entities/client.entity.js");
class ClientMapper {
    static toEntity(dto) {
        return new client_entity_js_1.Client({
            name: dto.name,
            email: dto.email ?? null,
            phone: dto.phone ?? null,
            address: dto.address ?? null,
            status: 'active',
        });
    }
    static toResponse(client) {
        return {
            id: client.id,
            name: client.name,
            email: client.email,
            phone: client.phone,
            address: client.address,
            status: client.status,
        };
    }
}
exports.ClientMapper = ClientMapper;
//# sourceMappingURL=client.mapper.js.map