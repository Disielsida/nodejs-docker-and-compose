import { Exclude, Expose, Type } from 'class-transformer';
import { UserPublicProfileResponseDto } from '../../users/dto/user-public-profile-response.dto';
import { WishResponseDto } from 'src/wishes/dto/wish-response.dto';

@Exclude()
export class OfferResponseDto {
  @Expose()
  id: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  amount: number;

  @Expose()
  hidden: boolean;

  @Expose()
  @Type(() => UserPublicProfileResponseDto)
  user: UserPublicProfileResponseDto;

  @Expose()
  @Type(() => WishResponseDto)
  item: WishResponseDto;
}
