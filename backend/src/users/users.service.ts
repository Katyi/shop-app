import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    const { password, ...result } = user;
    return result;
  }

  async update(userId: string, updateData: UpdateUserDto & { img?: string }) {
    try {
      const currentUser = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      // Удаление старой картинки, если пришла новая
      if (
        updateData.img &&
        currentUser?.img &&
        updateData.img !== currentUser.img
      ) {
        const oldPath = join(process.cwd(), currentUser.img);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: updateData,
      });

      const { password, ...result } = updatedUser;
      return result;
    } catch (error) {
      throw new BadRequestException('Failed to update user profile');
    }
  }
}
