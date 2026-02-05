import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import axios from 'axios';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(userId: string, address: string) {
    // 1. Получаем корзину и данные пользователя (чтобы узнать его имя)
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    const cartItems = await this.prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: { productTranslations: true }, // Берем переводы для названия
        },
      },
    });

    if (cartItems.length === 0) {
      throw new BadRequestException('Корзина пуста');
    }

    const totalAmount = cartItems.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    // 2. Транзакция создания заказа
    const order = await this.prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          address,
          totalAmount,
          items: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
        include: { items: true },
      });

      await tx.cartItem.deleteMany({ where: { userId } });
      return newOrder;
    });

    // 3. ОТПРАВЛЯЕМ УВЕДОМЛЕНИЕ В TELEGRAM
    // Формируем строку с товарами
    const productTitles = cartItems
      .map((item) => item.product.productTranslations?.[0]?.title || 'Товар')
      .join(', ');

    this.sendTelegramNotification({
      customerName: user?.email || 'Аноним',
      productTitle: productTitles,
      amount: totalAmount,
      address: address,
    });

    return order;
  }

  async getUserOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                productTranslations: true, // Добавляем переводы продуктов в заказе
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async sendTelegramNotification(orderData: any) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_MY_ID;

    const message = `
      🛍 **Новый заказ!**
      -------------------
      👤 Клиент: ${orderData.customerName}
      📦 Товар: ${orderData.productTitle}
      💰 Сумма: ${orderData.amount} руб.
      🏠 **Адрес:** ${orderData.address}
      📍 Статус: Оплачено
    `;

    try {
      const url = `https://api.telegram.org/bot${token}/sendMessage`;
      await axios.post(url, {
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown', // Чтобы работал жирный шрифт
      });
    } catch (error) {
      console.error('Ошибка отправки в Telegram:', error);
    }
  }
}
