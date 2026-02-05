import {
  Controller,
  Get,
  Query,
  NotFoundException,
  Post,
  Body,
} from '@nestjs/common';
import { AiService } from './ai.service.js';
import { ProductsService } from '../products/products.service.js';

@Controller('ai')
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly productsService: ProductsService,
  ) {}

  @Post('stylist')
  async getAdvice(
    @Body()
    body: {
      id: string;
      lang: string;
      // message?: string;
      history: any[];
    },
  ) {
    const product = await this.productsService.findOne(body.id);
    if (!product) throw new NotFoundException();

    const title = product.productTranslations?.[0]?.title || 'item';
    const categories = product.categories?.map((c) => c) || [];

    const advice = await this.aiService.getStylistAdvice(
      title,
      categories,
      body.lang,
      body.history, // Передаем сообщение из чата
    );

    return { text: advice };
  }
}
