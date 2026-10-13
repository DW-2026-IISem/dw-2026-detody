import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Req,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../access/jwt-auth.guard';
import { RefreshTokensService } from './refresh-tokens.service';

@Controller('api/sesiones')
@UseGuards(JwtAuthGuard)
export class RefreshTokensController {
  constructor(private readonly service: RefreshTokensService) {}

  @Get()
  async getAll(@Req() req: any) {
    const sessions = await this.service.getAllMine(req.auth.id);
    return { sessions };
  }

  @Patch('deactivate-all')
  async revokeAll(@Req() req: any) {
    const revoked = await this.service.revokeAllMine(req.auth.id);
    return { message: 'All sessions revoked', revoked };
  }

  @Get(':id')
  async getOne(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    const session = await this.service.getMine(req.auth.id, id);
    return { session };
  }

  @Patch(':id/deactivate')
  async revokeOne(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    const session = await this.service.revokeMine(req.auth.id, id);
    return { message: 'Session revoked', session };
  }

  @Delete()
  async purge(@Req() req: any) {
    const purged = await this.service.purgeMine(req.auth.id);
    return { message: 'Inactive sessions purged', purged };
  }
}
