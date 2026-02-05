import { IsOptional, IsString, IsEmail, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional() @IsString() username?: string;
  @IsOptional() @IsString() fullname?: string;
  @IsOptional() @IsString() gender?: string;
  @IsOptional() @IsString() birthday?: string;
  @IsOptional() @IsString() @MaxLength(20) phone?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() occupation?: string;
  @IsOptional() @IsEmail() email?: string;
}
