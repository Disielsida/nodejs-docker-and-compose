import { Exclude, Expose, Type } from 'class-transformer';
import { WishResponseDto } from '../../wishes/dto/wish-response.dto';
import { UserPublicProfileResponseDto } from '../../users/dto/user-public-profile-response.dto';

@Exclude()
export class WishlistResponseDto {
  @Expose()
  id: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  name: string;

  @Expose()
  description?: string;

  @Expose()
  image: string;

  @Expose()
  @Type(() => UserPublicProfileResponseDto)
  owner: UserPublicProfileResponseDto;

  @Expose()
  @Type(() => WishResponseDto)
  items: WishResponseDto[];
}
