import { Status, Timestamps } from './api.model';
import { Role } from './role.model';

export interface User extends Timestamps {
  id: number;
  username: string;
  email: string;
  avatar?: string | null;
  status: Status;
  roles?: Role[];
}

export interface UserPayload {
  username: string;
  email: string;
  password?: string;
  avatar?: string | null;
  status?: Status;
}
