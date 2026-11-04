import { HttpErrorResponse } from '@angular/common/http';

export function toApiMessage(error: unknown): string {
  if (!error) {
    return 'Error desconocido';
  }

  if (error instanceof HttpErrorResponse) {
    if (error.error) {
      if (typeof error.error === 'string') {
        return error.error;
      }
      if (Array.isArray(error.error.message)) {
        return error.error.message.join(', ');
      }
      if (typeof error.error.message === 'string') {
        return error.error.message;
      }
      if (error.error.error && typeof error.error.error === 'string') {
        return error.error.error;
      }
    }
    if (error.status === 0) {
      return 'No se pudo conectar con el servidor backend';
    }
    if (error.statusText) {
      return `Error ${error.status}: ${error.statusText}`;
    }
    return `Error HTTP ${error.status}`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}
