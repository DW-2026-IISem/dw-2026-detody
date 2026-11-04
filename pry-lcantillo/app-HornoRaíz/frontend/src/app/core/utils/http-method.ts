import { HttpMethod } from '../models/resource.model';

export function methodSeverity(
  method: HttpMethod | string | undefined,
): 'info' | 'success' | 'warn' | 'danger' | 'secondary' {
  switch (method?.toUpperCase()) {
    case 'GET':
      return 'info';
    case 'POST':
      return 'success';
    case 'PUT':
    case 'PATCH':
      return 'warn';
    case 'DELETE':
      return 'danger';
    default:
      return 'secondary';
  }
}
