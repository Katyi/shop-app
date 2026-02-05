import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async addToCart(
    userId: string,
    productId: string,
    quantity: number = 1,
    color?: string,
    size?: string,
  ) {
    // 1. Проверяем, есть ли уже такой товар у этого юзера
    const existingItem = await this.prisma.cartItem.findFirst({
      where: { userId, productId, color: color || null, size: size || null },
    });

    if (existingItem) {
      // 2. Если есть — обновляем количество
      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    }

    // 3. Если нет — создаем новую запись
    return this.prisma.cartItem.create({
      data: {
        userId,
        productId,
        quantity,
        color,
        size,
      },
    });
  }

  async getMyCart(userId: string) {
    return this.prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            productTranslations: true, // Глубокая загрузка переводов
          },
        },
      },
    });
  }

  async removeItem(userId: string, cartItemId: string) {
    return this.prisma.cartItem.deleteMany({
      where: { id: cartItemId, userId: userId },
    });
  }

  async updateQuantity(userId: string, cartItemId: string, quantity: number) {
    return this.prisma.cartItem.updateMany({
      where: { id: cartItemId, userId: userId },
      data: { quantity },
    });
  }

  async clearCart(userId: string) {
    return this.prisma.cartItem.deleteMany({
      where: { userId },
    });
  }

  async getTotal(userId: string) {
    const items = await this.prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            productTranslations: true,
          },
        },
      },
    });

    const totalAmount = items.reduce((acc, item) => {
      return acc + item.quantity * item.product.price;
    }, 0);

    return {
      totalAmount,
      itemCount: items.length,
    };
  }

  async updateItem(
    userId: string,
    cartItemId: string,
    data: { color?: string; size?: string; quantity?: number },
  ) {
    const currentItem = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
    });

    if (!currentItem || currentItem.userId !== userId) {
      throw new Error('Cart item not found');
    }

    if (data.color || data.size) {
      const targetColor =
        data.color !== undefined ? data.color : currentItem.color;
      const targetSize = data.size !== undefined ? data.size : currentItem.size;

      const duplicate = await this.prisma.cartItem.findFirst({
        where: {
          userId,
          productId: currentItem.productId,
          color: targetColor,
          size: targetSize,
          NOT: { id: cartItemId }, // Исключаем текущий элемент
        },
      });

      if (duplicate) {
        // Если дубликат найден — суммируем количество в дубликате и удаляем текущий
        const newQuantity =
          (data.quantity || currentItem.quantity) + duplicate.quantity;

        await this.prisma.cartItem.delete({ where: { id: cartItemId } });

        return this.prisma.cartItem.update({
          where: { id: duplicate.id },
          data: { quantity: newQuantity },
        });
      }
    }

    // 3. Если дубликата нет, просто обновляем текущий элемент
    return this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: {
        color: data.color !== undefined ? data.color : currentItem.color,
        size: data.size !== undefined ? data.size : currentItem.size,
        quantity:
          data.quantity !== undefined ? data.quantity : currentItem.quantity,
      },
    });
  }
}
