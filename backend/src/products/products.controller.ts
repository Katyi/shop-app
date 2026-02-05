import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { ProductsService } from './products.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import * as fs from 'fs';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(
    @Query('category') category?: string,
    @Query('color') color?: string,
    @Query('size') size?: string,
    @Query('sort') sort?: string,
    @Query('limit') limit?: string,
    @Query('page') page?: string,
    @Query('search') search?: string,
  ) {
    return this.productsService.findAll({
      category,
      color,
      size,
      sort,
      limit,
      page,
      search,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(
    FileInterceptor('img', {
      storage: diskStorage({
        // destination: './uploads/products',
        destination: (req, file, cb) => {
          const rootPath = process.env.UPLOAD_PATH || './uploads';
          const fullPath = join(rootPath, 'products'); // используем join для корректных путей

          if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
          }
          cb(null, fullPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `product-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
  ) {
    const imagePath = file
      ? `/uploads/products/${file.filename}`
      : '/uploads/default.png';

    return this.productsService.create({ ...createProductDto, img: imagePath });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(
    FileInterceptor('img', {
      storage: diskStorage({
        // destination: './uploads/products',
        destination: (req, file, cb) => {
          const rootPath = process.env.UPLOAD_PATH || './uploads';
          const fullPath = join(rootPath, 'products'); // используем join для корректных путей

          if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
          }
          cb(null, fullPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `product-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const imagePath = file ? `/uploads/products/${file.filename}` : undefined;

    return this.productsService.update(id, updateProductDto, imagePath);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(200)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.productsService.delete(id);
  }

  @Get(':id/related')
  async getRelated(@Param('id') id: string) {
    return this.productsService.getRelatedProducts(id);
  }
}
