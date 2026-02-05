import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginUserDTO {
  @IsEmail({}, { message: 'Некорректный email' })
  email: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'Пароль слишком короткий' })
  password: string;

  id: string;
}
