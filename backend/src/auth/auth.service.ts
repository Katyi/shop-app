import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { RegisterDto } from './dto/register.dto.js';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, username } = registerDto;

    // Check if user with the same email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // has password hashing logic here if needed
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
      },
    });

    const tokens = await this.login({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const { password: _, ...result } = user; // Exclude password from the returned user object
    return { user: result, ...tokens };
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const { password: _, ...result } = user;
    return result;
  }

  async login(user: { id: string; email: string; role: string }) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });

    const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });

    return {
      accessToken,
      refreshToken,
    };
  }

  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  // findUserById(id: string) {
  //   return this.prisma.user.findUnique({
  //     where: { id },
  //   });
  // }

  // async getMe(userId: string) {
  //   const user = await this.prisma.user.findUnique({
  //     where: { id: userId },
  //   });

  //   if (!user) {
  //     throw new UnauthorizedException('User not found');
  //   }

  //   const { password, ...result } = user;
  //   return result;
  // }

  // async updateUser(userId: string, updateData: Partial<any>) {
  //   try {
  //     const currentUser = await this.prisma.user.findUnique({
  //       where: { id: userId },
  //     });

  //     // if (updateData.img && currentUser?.img) {
  //     if (
  //       updateData.img &&
  //       currentUser?.img &&
  //       updateData.img !== currentUser.img
  //     ) {
  //       // Формируем полный путь к старому файлу
  //       // process.cwd() — это корень проекта
  //       const oldPath = join(process.cwd(), currentUser.img);

  //       // Проверяем, существует ли файл, и удаляем его
  //       if (fs.existsSync(oldPath)) {
  //         fs.unlinkSync(oldPath);
  //       }
  //     }

  //     const updatedUser = await this.prisma.user.update({
  //       where: { id: userId },
  //       data: {
  //         gender: updateData.gender,
  //         username: updateData.username,
  //         fullname: updateData.fullname,
  //         birthday: updateData.birthday,
  //         email: updateData.email,
  //         phone: updateData.phone,
  //         address: updateData.address,
  //         occupation: updateData.occupation,
  //         ...(updateData.img && { img: updateData.img }),
  //       },
  //     });

  //     const { password, ...result } = updatedUser;
  //     return result;
  //   } catch (error) {
  //     throw new BadRequestException('Failed to update user profile');
  //   }
  // }
}
