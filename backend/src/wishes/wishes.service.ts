import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async create(createWishDto: CreateWishDto, user: User): Promise<Wish> {
    const wish = {
      ...createWishDto,
      owner: user,
      raised: 0,
    };

    return this.wishRepository.save(wish);
  }

  async findLast(): Promise<Wish[]> {
    return this.wishRepository.find({
      order: { createdAt: 'DESC' },
      take: 40,
      relations: ['owner', 'offers', 'offers.user'],
    });
  }

  async findTop(): Promise<Wish[]> {
    return this.wishRepository.find({
      order: { copied: 'DESC' },
      take: 20,
      relations: ['owner', 'offers', 'offers.user'],
    });
  }

  async findOne(id: number): Promise<Wish> {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: ['owner', 'offers', 'offers.user'],
    });

    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }

    return wish;
  }

  async findWish(id: number, user: User): Promise<Wish> {
    const wish = await this.findOne(id);

    wish.offers = wish.offers.filter(
      (offer) => !offer.hidden || offer.user.id === user.id,
    );

    return wish;
  }

  async updateOne(wish: Wish, updateWishDto: UpdateWishDto): Promise<Wish> {
    return this.wishRepository.save({ ...wish, ...updateWishDto });
  }

  async updateWish(
    id: number,
    updateWishDto: UpdateWishDto,
    user: User,
  ): Promise<Wish> {
    const wish = await this.findOne(id);

    if (wish.owner.id !== user.id) {
      throw new ForbiddenException('Нельзя изменить чужой подарок');
    }

    if (wish.offers.length > 0) {
      throw new BadRequestException('Уже есть предложения');
    }

    return this.updateOne(wish, updateWishDto);
  }

  async removeOne(id: number): Promise<void> {
    await this.wishRepository.delete(id);
  }

  async removeWish(id: number, user: User): Promise<Wish> {
    const wish = await this.findOne(id);

    if (wish.owner.id !== user.id) {
      throw new ForbiddenException('Нельзя удалить чужой подарок');
    }

    if (wish.offers.length > 0) {
      throw new BadRequestException('Уже есть предложения');
    }

    await this.removeOne(id);

    return wish;
  }

  async copyOne(id: number, user: User): Promise<Wish> {
    const wish = await this.findOne(id);

    wish.copied += 1;
    await this.wishRepository.save(wish);

    const newWish = this.wishRepository.create({
      name: wish.name,
      link: wish.link,
      image: wish.image,
      price: wish.price,
      description: wish.description,
      owner: user,
      raised: 0,
    });

    return this.wishRepository.save(newWish);
  }

  async findManyByOwnerId(id: number): Promise<Wish[]> {
    return this.wishRepository.find({
      where: { owner: { id } },
      relations: ['owner', 'offers', 'offers.user'],
    });
  }

  async findManyWishes(id: number, user: User): Promise<Wish[]> {
    const wishes = await this.findManyByOwnerId(id);

    wishes.forEach((wish) => {
      wish.offers = wish.offers.filter(
        (offer) => !offer.hidden || offer.user.id === user.id,
      );
    });

    return wishes;
  }

  async updateOneRaised(id: number, raised: number): Promise<void> {
    await this.wishRepository.update(id, { raised });
  }

  async findManyByIds(ids: number[]): Promise<Wish[]> {
    return this.wishRepository.findBy({
      id: In(ids),
    });
  }
}
