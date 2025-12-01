import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { WishesService } from '../wishes/wishes.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private wishesService: WishesService,
  ) {}

  async create(offer: Offer): Promise<Offer> {
    return this.offerRepository.save(offer);
  }

  async createOffer(createOfferDto: CreateOfferDto, user: User) {
    const item = await this.wishesService.findOne(createOfferDto.itemId);

    if (item.owner.id === user.id) {
      throw new BadRequestException('Нельзя поддержать свой подарок');
    }

    if (item.raised >= item.price) {
      throw new BadRequestException('Сумма собрана');
    }

    if (createOfferDto.amount > item.price - item.raised) {
      throw new BadRequestException('Сумма предложения превышает остаток цены');
    }

    const offer = this.offerRepository.create({
      amount: createOfferDto.amount,
      hidden: createOfferDto.hidden,
      user,
      item,
    });

    item.raised += offer.amount;
    await this.wishesService.updateOneRaised(item.id, item.raised);

    return this.create(offer);
  }

  async findAll(user: User): Promise<Offer[]> {
    return this.offerRepository.find({
      where: { user },
      relations: ['user', 'item', 'item.owner'],
    });
  }

  async findOne(id: number): Promise<Offer> {
    const offer = await this.offerRepository.findOne({
      where: { id },
      relations: ['user', 'item', 'item.owner'],
    });

    if (!offer) {
      throw new NotFoundException('Предложение не найдено');
    }

    return offer;
  }

  async findOffer(id: number, user: User): Promise<Offer> {
    const offer = await this.findOne(id);

    const isOwner = offer.user.id === user.id;

    if (!isOwner && offer.hidden) {
      throw new NotFoundException('Предложение не найдено');
    }

    return offer;
  }
}
