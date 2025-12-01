import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserPublicProfileResponseDto {
  @Expose()
  id: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  username: string;

  @Expose()
  about: string;

  @Expose()
  avatar: string;
}
