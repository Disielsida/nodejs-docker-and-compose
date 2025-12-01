import { IsNumber, IsNotEmpty, Min, IsBoolean } from 'class-validator';

export class CreateOfferDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  amount: number;

  @IsNotEmpty()
  @IsBoolean()
  hidden: boolean;

  @IsNotEmpty()
  @IsNumber()
  itemId: number;
}
