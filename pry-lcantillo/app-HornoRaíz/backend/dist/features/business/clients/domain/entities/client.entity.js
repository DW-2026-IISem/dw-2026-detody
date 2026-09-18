export class Client {
    id;
    name;
    email;
    phone;
    address;
    status;
    constructor(props) {
        this.id = props.id ?? null;
        this.name = props.name;
        this.email = props.email ?? null;
        this.phone = props.phone ?? null;
        this.address = props.address ?? null;
        this.status = props.status ?? 'active';
    }
}
//# sourceMappingURL=client.entity.js.map