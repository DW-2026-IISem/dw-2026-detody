"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
class Client {
    constructor(props) {
        this.id = props.id ?? null;
        this.name = props.name;
        this.email = props.email ?? null;
        this.phone = props.phone ?? null;
        this.address = props.address ?? null;
        this.status = props.status ?? 'active';
    }
}
exports.Client = Client;
//# sourceMappingURL=client.entity.js.map