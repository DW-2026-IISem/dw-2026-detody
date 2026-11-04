import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification';
import { toApiMessage } from '../utils/api-error';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notify = inject(NotificationService);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 403) {
          notify.error('Acceso denegado', 'No posees permisos para ejecutar esta acción.');
        } else if (error.status >= 500) {
          notify.error('Error del servidor', toApiMessage(error));
        } else if (error.status === 0) {
          notify.error('Sin conexión', 'No fue posible comunicarse con el servidor.');
        }
      }
      return throwError(() => error);
    }),
  );
};
