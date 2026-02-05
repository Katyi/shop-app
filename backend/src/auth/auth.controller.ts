import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { UsersService } from '../users/users.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginUserDTO } from './dto/login.dto.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginUserDTO) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (user instanceof UnauthorizedException) {
      throw user;
    }

    return this.authService.login({
      id: user.id,
      email: user.email,
      role: user.role,
    });
  }

  @Post('refresh')
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    // 1. Проверяем, пришло ли вообще значение в поле 'refreshToken'
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    try {
      // 2. Проверяем подпись и срок годности токена
      const payload = this.authService.verifyToken(refreshToken);

      // 3. Достаем пользователя по id (sub) из токена
      // const user = await this.authService.findUserById(payload.sub);
      const user = await this.usersService.findById(payload.sub);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // 4. Генерируем новую пару токенов (access + refresh)
      return this.authService.login({
        id: user.id,
        email: user.email,
        role: user.role,
      });
    } catch (e) {
      // Если токен подделан, истек или поврежден — летит 401 ошибка
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout() {
    // Если у вас есть логика удаления refreshToken из БД, вызывайте её здесь
    return { message: 'Logged out successfully' };
  }
}
