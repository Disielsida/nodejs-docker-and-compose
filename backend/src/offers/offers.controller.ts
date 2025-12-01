import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { plainToInstance } from 'class-transformer';
import { User } from '../users/entities/user.entity';
import { OfferResponseDto } from './dto/offer-response.dto';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @UseGuards(JwtGuard)
  @Post()
  async createOffer(
    @Body() createOfferDto: CreateOfferDto,
    @Req() req: Request & { user: User },
  ): Promise<OfferResponseDto> {
    const offer = await this.offersService.createOffer(
      createOfferDto,
      req.user,
    );

    return plainToInstance(OfferResponseDto, offer, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(JwtGuard)
  @Get()
  async getAllOffers(
    @Req() req: Request & { user: User },
  ): Promise<OfferResponseDto[]> {
    const offers = await this.offersService.findAll(req.user);

    return plainToInstance(OfferResponseDto, offers, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getOffer(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { user: User },
  ): Promise<OfferResponseDto> {
    const offer = await this.offersService.findOffer(id, req.user);

    return plainToInstance(OfferResponseDto, offer, {
      excludeExtraneousValues: true,
    });
  }
}
