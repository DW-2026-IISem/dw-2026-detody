import { Status, Timestamps } from './api.model';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
export const HTTP_METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

export interface Resource extends Timestamps {
  id: number;
  name?: string;
  method?: HttpMethod;
  path?: string;
  route_path?: string;
  routePath?: string;
  http_method?: HttpMethod;
  httpMethod?: HttpMethod;
  description?: string | null;
  status?: Status;
}

export interface ResourcePayload {
  name?: string;
  method?: HttpMethod;
  path?: string;
  route_path?: string;
  routePath?: string;
  http_method?: HttpMethod;
  httpMethod?: HttpMethod;
  description?: string | null;
  status?: Status;
}
