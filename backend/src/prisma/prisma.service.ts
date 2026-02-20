import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg'; // Импорт адаптера
// import { PrismaNeon } from '@prisma/adapter-neon';
// import pg from 'pg';
// import { neonConfig } from '@neondatabase/serverless';
// import ws from 'ws';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    // neonConfig.webSocketConstructor = ws;

    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
      // connectionString: process.env.DATABASE_URL,
    });

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
