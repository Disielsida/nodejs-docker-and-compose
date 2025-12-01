import { Exclude, Expose, Type } from 'class-transformer';
import { OfferResponseDto } from '../../offers/dto/offer-response.dto';
import { UserPublicProfileResponseDto } from '../../users/dto/user-public-profile-response.dto';

@Exclude()
export class WishResponseDto {
  @Expose()
  id: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  name: string;

  @Expose()
  link: string;

  @Expose()
  image: string;

  @Expose()
  price: number;

  @Expose()
  raised: number;

  @Expose()
  description: string;

  @Expose()
  copied: number;

  @Expose()
  @Type(() => UserPublicProfileResponseDto)
  owner: UserPublicProfileResponseDto;

  @Expose()
  @Type(() => OfferResponseDto)
  offers: OfferResponseDto[];
}
