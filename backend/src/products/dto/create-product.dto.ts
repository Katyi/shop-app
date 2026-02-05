import { plainToInstance, Transform, Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  IsBoolean,
  Min,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';

export class ProductTranslationDto {
  @IsString()
  @IsNotEmpty()
  language: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}

export class CreateProductDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductTranslationDto)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const parsed = JSON.parse(value);
      // Явно превращаем обычные объекты в экземпляры нужного класса
      return plainToInstance(ProductTranslationDto, parsed);
    }
    return value;
  })
  productTranslations: ProductTranslationDto[];

  // @IsString()
  img: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  categories?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  size?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  color?: string[];

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @Min(0)
  price: number;

  @IsOptional()
  @Transform(({ value }) => {
    // Если пришла строка "null", пустая строка или само значение null
    if (value === 'null' || value === '' || value === null) return null;
    return Number(value);
  })
  oldPrice?: number | null;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;

    return value; // оставляем как есть, если не пришло
  })
  inStock?: boolean;
}
