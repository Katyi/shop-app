// payment.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentService {
  constructor() {}

  async createPaymentIntent(amount: number) {
    const fakeId = 'fake_' + Math.random().toString(36).substring(7);
    return {
      client_secret: fakeId + '_secret_test',
      id: fakeId,
    };
  }
}
