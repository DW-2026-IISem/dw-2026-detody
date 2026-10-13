import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { extractBearerToken, verifyAccessToken } from "../../../shared/auth/jwt";
import { UserService } from "../users/application/user.service";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly usersRepository: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = extractBearerToken(request.headers.authorization);

    if (!token) {
      throw new UnauthorizedException("Missing Bearer token");
    }

    try {
      const payload = verifyAccessToken(token);
      const userId = Number(payload.sub);

      if (!Number.isInteger(userId) || userId < 1) {
        throw new UnauthorizedException("Invalid or expired access token");
      }

      const repo = this.usersRepository as any;
      const userObj = typeof repo.findById === "function"
        ? await repo.findById(userId)
        : (typeof repo.findOne === "function" ? await repo.findOne({ where: { id: userId } }) : null);

      if (!userObj || userObj.status !== "active") {
        throw new UnauthorizedException("User is not active");
      }

      request.auth = {
        id: userObj.id,
        username: userObj.username,
        email: userObj.email,
        tokenId: payload.jti,
      };

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException("Invalid or expired access token");
    }
  }
}
