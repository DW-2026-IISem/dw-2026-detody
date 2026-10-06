export interface AuthUser {
    id: number;
    username: string;
    email?: string;
    tokenId?: string;
}
declare global {
    namespace Express {
        interface Request {
            auth?: AuthUser;
        }
    }
}
