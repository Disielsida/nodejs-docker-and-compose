import { Controller, Get, Post, Body, Patch, Param, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from '../auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';
import { plainToInstance } from 'class-transformer';
import { User } from './entities/user.entity';
import { WishResponseDto } from '../wishes/dto/wish-response.dto';
import { UserPublicProfileResponseDto } from './dto/user-public-profile-response.dto';
import { FindUserDto } from './dto/find-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtGuard)
  @Get('me')
  async getOwnProfile(
    @Req() req: Request & { user: User },
  ): Promise<UserProfileResponseDto> {
    return plainToInstance(UserProfileResponseDto, req.user, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(JwtGuard)
  @Patch('me')
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request & { user: User },
  ): Promise<UserProfileResponseDto> {
    const updatedUser = await this.usersService.updateUser(
      req.user,
      updateUserDto,
    );

    return plainToInstance(UserProfileResponseDto, updatedUser, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(JwtGuard)
  @Get('me/wishes')
  async getOwnWishes(
    @Req() req: Request & { user: User },
  ): Promise<WishResponseDto[]> {
    const wishes = await this.usersService.findOwnWishes(req.user);

    return plainToInstance(WishResponseDto, wishes, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(JwtGuard)
  @Get(':username')
  async getPublicProfile(
    @Param('username') username: string,
  ): Promise<UserPublicProfileResponseDto> {
    const profile = await this.usersService.findOneByUsername(username);

    return plainToInstance(UserPublicProfileResponseDto, profile, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(JwtGuard)
  @Get(':username/wishes')
  async getPublicWishes(
    @Param('username') username: string,
    @Req() req: Request & { user: User },
  ): Promise<WishResponseDto[]> {
    const wishes = await this.usersService.findPublicWishes(username, req.user);

    return plainToInstance(WishResponseDto, wishes, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(JwtGuard)
  @Post('find')
  async findUser(
    @Body() query: FindUserDto,
  ): Promise<UserPublicProfileResponseDto[]> {
    const users = await this.usersService.findManyByEmailOrUsername(query);

    return plainToInstance(UserPublicProfileResponseDto, users, {
      excludeExtraneousValues: true,
    });
  }
}
