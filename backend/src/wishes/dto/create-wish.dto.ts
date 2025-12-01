import {
  IsString,
  IsNumber,
  Length,
  IsUrl,
  IsNotEmpty,
  Min,
} from 'class-validator';

export class CreateWishDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 250)
  name: string;

  @IsUrl()
  @IsNotEmpty()
  link: string;

  @IsUrl()
  @IsNotEmpty()
  image: string;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  price: number;

  @IsString()
  @Length(1, 1024)
  @IsNotEmpty()
  description: string;
}
