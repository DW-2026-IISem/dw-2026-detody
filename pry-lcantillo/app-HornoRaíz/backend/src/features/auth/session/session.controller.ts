import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Req } from '@nestjs/common';
import { SessionService } from './session.service.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtAuthGuard } from '../access/jwt-auth.guard.js';

@Controller(['sesion', 'session'])
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Req() req: any) {
    const userAgent = req.headers['user-agent'] || null;
    return this.sessionService.login(dto, userAgent);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: { refresh_token: string }, @Req() req: any) {
    const userAgent = req.headers['user-agent'] || null;
    return this.sessionService.rotate(dto.refresh_token, userAgent);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body() dto: { refresh_token?: string }) {
    return this.sessionService.logout(dto?.refresh_token || '');
  }

  @UseGuards(JwtAuthGuard)
  @Get(['perfil', 'profile'])
  getProfile(@Req() req: any) {
    return {
      user: {
        id: req.auth.id,
        username: req.auth.username,
        email: req.auth.email,
        status: 'active',
      },
    };
  }
}
