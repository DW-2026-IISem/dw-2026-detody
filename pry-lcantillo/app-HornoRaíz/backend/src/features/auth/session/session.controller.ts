import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Request } from '@nestjs/common';
import { SessionService } from './session.service.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtAuthGuard } from '../access/jwt-auth.guard.js';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return this.sessionService.login(dto);
  }

  // Protegido solo con JWT, sin RBAC, para que el Operador sí pueda entrar
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return {
      statusCode: 200,
      message: 'Perfil recuperado del token',
      data: req.user,
    };
  }
}
