import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import * as fs from 'fs';
import { join } from 'path';

interface FindAllQuery {
  category?: string;
  color?: string;
  size?: string;
  sort?: string;
  limit?: string;
  page?: string;
  search?: string;
}

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // private deleteFile(filePath: string) {
  //   if (filePath && filePath !== '/uploads/default.png') {
  //     const fullPath = join(process.cwd(), filePath);
  //     if (fs.existsSync(fullPath)) {
  //       try {
  //         fs.unlinkSync(fullPath);
  //       } catch (err) {
  //         console.error(`Failed to delete file: ${fullPath}`, err);
  //       }
  //     }
  //   }
  // }

  private deleteFile(filePath: string) {
    // filePath приходит из базы как "/uploads/products/name.jpg"
    if (filePath && filePath !== '/uploads/default.png') {
      // Вычисляем физический путь на диске
      let fullPath: string;

      if (process.env.UPLOAD_PATH) {
        // Если мы на сервере, убираем префикс "/uploads" и соединяем с корнем из .env
        // Например: /var/www/uploads + /products/name.jpg
        const relativePath = filePath.replace('/uploads', '');
        fullPath = join(process.env.UPLOAD_PATH, relativePath);
      } else {
        // Если локально на Mac, используем старую логику от корня проекта
        fullPath = join(process.cwd(), filePath);
      }

      if (fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath);
        } catch (err) {
          console.error(`Failed to delete file: ${fullPath}`, err);
        }
      }
    }
  }

  private normalizeData(data: any) {
    const normalized = { ...data };

    // Обрабатываем ТОЛЬКО массивы, которые приходят строкой
    ['categories', 'size', 'color'].forEach((key) => {
      if (typeof normalized[key] === 'string') {
        normalized[key] = normalized[key]
          .split(',')
          .map((s: string) => s.trim())
          .filter(Boolean);
      }
    });

    // ВАЖНО: Не переопределяй здесь oldPrice и inStock!
    // Если они уже пришли из DTO как null или false,
    // любая проверка типа if(normalized.oldPrice) превратит null в false и пропустит блок.

    return normalized;
  }

  async findAll(query: FindAllQuery) {
    const { category, color, size, sort, limit, page, search } = query;

    const where: any = {};

    if (category && category.toLowerCase() !== 'all') {
      // 1. Разбиваем строку "women,socks" в массив ["women", "socks"]
      const categoryArray = category
        .split(',')
        .map((c) => c.trim().toLowerCase());

      if (categoryArray.length > 1) {
        // 2. Находит товары, где в массиве categories есть ВСЕ элементы из categoryArray
        where.categories = { hasEvery: categoryArray };
      } else {
        // 3. Если категория одна, используем обычный has
        where.categories = { has: categoryArray[0] };
      }
    }

    if (color) {
      where.color = { has: color.toLowerCase() };
    }

    if (size) {
      where.size = { has: size.toLowerCase() };
    }

    if (search) {
      where.productTranslations = {
        some: {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        },
      };
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    else if (sort === 'price_desc') orderBy = { price: 'desc' };
    else if (sort === 'oldest') orderBy = { createdAt: 'asc' };

    const [products, totalCount] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy,
        include: {
          productTranslations: true,
        },
        take: limit ? parseInt(limit) : undefined,
        skip:
          page && limit ? (parseInt(page) - 1) * parseInt(limit) : undefined,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      products,
      totalCount,
    };
  }

  async findOne(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        productTranslations: true,
      },
    });
  }

  async create(createProductDto: CreateProductDto) {
    const { productTranslations, ...rest } = createProductDto;
    const data = this.normalizeData(rest);

    return this.prisma.product.create({
      data: {
        ...data,
        productTranslations: {
          create: productTranslations,
        },
      },
      include: { productTranslations: true },
    });
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    newImagePath?: string,
  ) {
    const { productTranslations, ...rest } = updateProductDto;
    const data = this.normalizeData(rest);

    if (newImagePath) {
      const oldProduct = await this.prisma.product.findUnique({
        where: { id },
      });
      if (oldProduct?.img) {
        this.deleteFile(oldProduct.img);
      }
      data.img = newImagePath;
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        ...data,
        ...(productTranslations && {
          productTranslations: {
            deleteMany: {},
            create: productTranslations,
          },
        }),
      },
      include: { productTranslations: true },
    });
  }

  async delete(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (product) {
      this.deleteFile(product.img);
    }

    return this.prisma.product.delete({ where: { id } });
  }

  async getRelatedProducts(id: string) {
    // 1. Сначала найдем текущий товар, чтобы узнать его категории
    const currentProduct = await this.prisma.product.findUnique({
      where: { id },
      select: { categories: true },
    });

    if (!currentProduct) return [];

    // 2. Ищем товары, у которых есть хотя бы одна общая категория
    return this.prisma.product.findMany({
      where: {
        categories: {
          hasSome: currentProduct.categories, // Пересечение массивов
        },
        id: {
          not: id, // Исключаем сам текущий товар
        },
      },
      take: 4, // Ограничиваем выдачу
    });
  }
}
