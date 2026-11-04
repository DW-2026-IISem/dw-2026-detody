import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const res = context.switchToHttp().getResponse();
    const req = context.switchToHttp().getRequest();
    return next.handle().pipe(
      map((data) => {
        const url = req.originalUrl || req.url || '';
        // Preservar estructura directa para autenticación, sesión y permisos de Fase II
        if (
          url.includes('/sesion') ||
          url.includes('/session') ||
          url.includes('/permisos') ||
          url.includes('/permissions')
        ) {
          return data;
        }
        return {
          statusCode: res.statusCode,
          message: 'OK',
          data: data ?? null,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
