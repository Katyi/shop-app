import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';

// @Global()
@Module({
  exports: [PrismaService],
  providers: [PrismaService],
})
export class PrismaModule {}
