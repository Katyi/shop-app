import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('users') // Теперь URL будет /users/me и /users/update
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@Request() req) {
    return this.usersService.findById(req.user.id);
  }

  @Patch('update')
  @UseInterceptors(
    FileInterceptor('img', {
      storage: diskStorage({
        destination: (req, file, callback) => {
          const rootPath = process.env.UPLOAD_PATH || './uploads';
          const fullPath = `${rootPath}/users`;
          callback(null, fullPath);
        },
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async update(
    @Request() req,
    @Body() updateData: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const data = { ...updateData };
    if (file) {
      data['img'] = `/uploads/users/${file.filename}`;
    }
    return this.usersService.update(req.user.id, data);
  }
}
