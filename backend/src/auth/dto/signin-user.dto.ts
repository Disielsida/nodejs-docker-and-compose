import { IsString, Length, IsNotEmpty, MinLength } from 'class-validator';

export class SigninUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 30)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  password: string;
}
