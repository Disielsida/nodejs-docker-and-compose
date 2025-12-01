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
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { WishResponseDto } from './dto/wish-response.dto';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { plainToInstance } from 'class-transformer';
import { User } from '../users/entities/user.entity';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  async createWish(
    @Body() createWishDto: CreateWishDto,
    @Req() req: Request & { user: User },
  ): Promise<WishResponseDto> {
    const wish = await this.wishesService.create(createWishDto, req.user);

    return plainToInstance(WishResponseDto, wish, {
      excludeExtraneousValues: true,
    });
  }

  @Get('last')
  async getLastWishes(): Promise<WishResponseDto[]> {
    const wishes = await this.wishesService.findLast();

    return plainToInstance(WishResponseDto, wishes, {
      excludeExtraneousValues: true,
    });
  }

  @Get('top')
  async getTopWishes(): Promise<WishResponseDto[]> {
    const wishes = await this.wishesService.findTop();

    return plainToInstance(WishResponseDto, wishes, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getWish(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { user: User },
  ): Promise<WishResponseDto> {
    const wish = await this.wishesService.findWish(id, req.user);

    return plainToInstance(WishResponseDto, wish, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateWish(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWishDto: UpdateWishDto,
    @Req() req: Request & { user: User },
  ): Promise<WishResponseDto> {
    const updatedWish = await this.wishesService.updateWish(
      id,
      updateWishDto,
      req.user,
    );

    return plainToInstance(WishResponseDto, updatedWish, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async removeWish(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { user: User },
  ): Promise<WishResponseDto> {
    const updatedWish = await this.wishesService.removeWish(id, req.user);

    return plainToInstance(WishResponseDto, updatedWish, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  async copyWish(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { user: User },
  ): Promise<WishResponseDto> {
    const copiedWish = await this.wishesService.copyOne(id, req.user);

    return plainToInstance(WishResponseDto, copiedWish, {
      excludeExtraneousValues: true,
    });
  }
}
