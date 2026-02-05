import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest();

    // Проверяем, есть ли у пользователя роль ADMIN
    if (user?.role !== 'ADMIN') {
      throw new ForbiddenException('You do not have permission (Admin only)');
    }

    return true;
  }
}
