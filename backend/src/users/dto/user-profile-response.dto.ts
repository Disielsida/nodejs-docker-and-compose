import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserProfileResponseDto {
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

  @Expose()
  email: string;
}
