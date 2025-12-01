import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { plainToInstance } from 'class-transformer';
import { User } from '../users/entities/user.entity';
import { WishlistResponseDto } from './dto/wishlist-response.dto';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @UseGuards(JwtGuard)
  @Get()
  async getAllWishlists(): Promise<WishlistResponseDto[]> {
    const wishlists = await this.wishlistsService.findAll();

    return plainToInstance(WishlistResponseDto, wishlists, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(JwtGuard)
  @Post()
  async createWishlist(
    @Body() createWishlistDto: CreateWishlistDto,
    @Req() req: Request & { user: User },
  ): Promise<WishlistResponseDto> {
    const wish = await this.wishlistsService.create(
      createWishlistDto,
      req.user,
    );

    return plainToInstance(WishlistResponseDto, wish, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getWishlist(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<WishlistResponseDto> {
    const wishlist = await this.wishlistsService.findOne(id);

    return plainToInstance(WishlistResponseDto, wishlist, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateWishlist(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Req() req: Request & { user: User },
  ): Promise<WishlistResponseDto> {
    const updatedsWishlist = await this.wishlistsService.updateWishlist(
      id,
      updateWishlistDto,
      req.user,
    );

    return plainToInstance(WishlistResponseDto, updatedsWishlist, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async removeWishlist(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { user: User },
  ): Promise<WishlistResponseDto> {
    const removedWish = await this.wishlistsService.removeWishlist(
      id,
      req.user,
    );

    return plainToInstance(WishlistResponseDto, removedWish, {
      excludeExtraneousValues: true,
    });
  }
}
