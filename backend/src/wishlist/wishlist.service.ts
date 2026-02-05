import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  async toggleWishlist(userId: string, productId: string) {
    // 1. Проверяем, существует ли товар вообще
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Товар не найден');

    // 2. Ищем пользователя и его текущий список избранного
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { wishlist: true },
    });

    // 3. Проверяем, есть ли уже этот товар в избранном
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    const wishlistArray = Array.isArray(user.wishlist) ? user.wishlist : [];
    const isFavorite = wishlistArray.some((item) => item.id === productId);

    // 4. Если есть — удаляем связь (disconnect), если нет — создаем (connect)
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        wishlist: isFavorite
          ? { disconnect: { id: productId } }
          : { connect: { id: productId } },
      },
      // include: { wishlist: true }, // Возвращаем обновленный список
      include: {
        wishlist: {
          include: { productTranslations: true }, // Добавляем переводы при обновлении
        },
      },
    });
  }

  async getMyWishlist(userId: string) {
    // const user = await this.prisma.user.findUnique({
    //   where: { id: userId },
    //   include: { wishlist: true },
    // });
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        wishlist: {
          include: { productTranslations: true }, // Добавляем переводы при получении списка
        },
      },
    });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return user.wishlist;
  }

  async clearWishlist(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('Пользователь не найден');

    // return this.prisma.user.update({
    //   where: { id: userId },
    //   data: {
    //     wishlist: {
    //       set: [], // Это удаляет ВСЕ связи пользователя с товарами в таблице избранного
    //     },
    //   },
    //   include: { wishlist: true },
    // });
    return this.prisma.user.update({
      where: { id: userId },
      data: { wishlist: { set: [] } },
      include: {
        wishlist: {
          include: { productTranslations: true },
        },
      },
    });
  }
}
