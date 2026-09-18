export type ClientStatus = 'active' | 'inactive';
export interface ClientProps {
    id?: number | null;
    name: string;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    status?: ClientStatus;
}
export declare class Client {
    readonly id: number | null;
    readonly name: string;
    readonly email: string | null;
    readonly phone: string | null;
    readonly address: string | null;
    readonly status: ClientStatus;
    constructor(props: ClientProps);
}
