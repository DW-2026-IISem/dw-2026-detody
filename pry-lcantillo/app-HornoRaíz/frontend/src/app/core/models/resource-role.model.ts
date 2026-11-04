import { Timestamps } from './api.model';
import { Resource } from './resource.model';
import { Role } from './role.model';

export interface ResourceRole extends Timestamps {
  id?: number;
  role_id?: number;
  roleId?: number;
  resource_id?: number;
  resourceId?: number;
  role?: Role;
  resource?: Resource;
}

export interface ResourceRolePayload {
  role_id?: number;
  roleId?: number;
  resource_id?: number;
  resourceId?: number;
}
