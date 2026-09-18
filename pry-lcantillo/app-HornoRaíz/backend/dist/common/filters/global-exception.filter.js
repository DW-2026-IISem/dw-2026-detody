var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Catch, HttpException, HttpStatus } from '@nestjs/common';
import { ApplicationException } from '../exceptions/application.exception.js';
let GlobalExceptionFilter = class GlobalExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse();
        const req = ctx.getRequest();
        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Error interno del servidor';
        if (exception instanceof ApplicationException) {
            status = exception.statusCode;
            message = exception.message;
        }
        else if (exception instanceof HttpException) {
            status = exception.getStatus();
            message = exception.getResponse().message ?? exception.message;
        }
        else if (exception instanceof Error) {
            message = exception.message;
        }
        res.status(status).json({
            statusCode: status,
            message: Array.isArray(message) ? message.join('; ') : message,
            timestamp: new Date().toISOString(),
            path: req.url,
        });
    }
};
GlobalExceptionFilter = __decorate([
    Catch()
], GlobalExceptionFilter);
export { GlobalExceptionFilter };
//# sourceMappingURL=global-exception.filter.js.map