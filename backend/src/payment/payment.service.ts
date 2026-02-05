// payment.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    // this.stripe = new Stripe('твой_sk_test_ключ', {
    const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      throw new Error(
        'STRIPE_SECRET_KEY is not defined in environment variables',
      );
    }
    this.stripe = new Stripe(stripeSecretKey, {
      // apiVersion: '2025-12-15.clover' as const,
      // apiVersion: '2024-12-18.preview' as any,
    });
  }

  async createPaymentIntent(amount: number) {
    // amount должен быть в минимальных единицах валюты (центы/копейки)
    // Если цена 10$, передаем 1000
    return this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    });
  }
}
