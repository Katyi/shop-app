import {
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
  IsString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ProductTranslationDto } from './create-product.dto.js';

export class UpdateProductDto {
  @IsOptional()
  @IsArray()
  productTranslations?: ProductTranslationDto[];

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => {
    if (value === 'null' || value === '') return null;
    return value === undefined ? undefined : Number(value);
  })
  oldPrice?: number | null;

  @IsOptional()
  // @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  })
  inStock?: boolean;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  price?: number;

  // Добавь остальные поля, которые могут обновляться (categories, size, color и т.д.)
  img?: string;
}
