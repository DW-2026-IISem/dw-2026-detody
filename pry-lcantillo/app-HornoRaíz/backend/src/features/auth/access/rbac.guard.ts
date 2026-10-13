import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from "@nestjs/common";
import { isOperationGranted, normalizePath } from "../../../shared/auth/resource-match";
import { ResourceRoleService } from "../resource-roles/application/resource-role.service";

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(private readonly resourceRolesRepository: ResourceRoleService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.auth) {
      throw new UnauthorizedException("Authentication required");
    }

    const method = request.method.toUpperCase();
    const path = normalizePath(request.originalUrl);

    const repo = this.resourceRolesRepository as any;
    const granted = typeof repo.findEffectiveForUser === "function"
      ? await repo.findEffectiveForUser(request.auth.id)
      : [];

    if (!isOperationGranted(granted, method, path)) {
      throw new ForbiddenException(`Forbidden: no grant for ${method} ${path}`);
    }

    return true;
  }
}
