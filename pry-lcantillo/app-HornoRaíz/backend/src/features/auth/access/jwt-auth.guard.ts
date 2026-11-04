import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { extractBearerToken, verifyAccessToken } from '../../../shared/auth/jwt.js';
import { UserService } from '../users/application/user.service.js';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly usersRepository: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = extractBearerToken(request.headers.authorization);

    if (process.env.AUTH_ENABLED === 'false') {
      if (token) {
        try {
          const payload = verifyAccessToken(token);
          const userId = Number(payload.sub);
          const userObj = await this.usersRepository.findById(userId);
          if (userObj) {
            request.auth = {
              id: userObj.id,
              username: userObj.username,
              email: userObj.email,
              tokenId: payload.jti,
            };
            request.user = request.auth;
            return true;
          }
        } catch {}
      }
      request.auth = { id: 1, username: 'admin', email: 'admin@hornoraiz.com' };
      request.user = request.auth;
      return true;
    }

    if (!token) {
      throw new UnauthorizedException('Missing Bearer token');
    }

    try {
      const payload = verifyAccessToken(token);
      const userId = Number(payload.sub);

      if (!Number.isInteger(userId) || userId < 1) {
        throw new UnauthorizedException('Invalid or expired access token');
      }

      const userObj = await this.usersRepository.findById(userId);

      if (!userObj || userObj.status !== 'active') {
        throw new UnauthorizedException('User is not active');
      }

      request.auth = {
        id: userObj.id,
        username: userObj.username,
        email: userObj.email,
        tokenId: payload.jti,
      };
      request.user = request.auth;

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }
}
