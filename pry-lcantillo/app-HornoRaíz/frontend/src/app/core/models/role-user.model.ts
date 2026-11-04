import { Timestamps } from './api.model';
import { Role } from './role.model';
import { User } from './user.model';

export interface RoleUser extends Timestamps {
  id?: number;
  user_id?: number;
  userId?: number;
  role_id?: number;
  roleId?: number;
  user?: User;
  role?: Role;
}

export interface RoleUserPayload {
  user_id?: number;
  userId?: number;
  role_id?: number;
  roleId?: number;
}
