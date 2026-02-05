import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service.js';
import { PaymentController } from './payment.controller.js';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService], // Экспортируем, если захотим использовать Stripe в других сервисах
})
export class PaymentModule {}
