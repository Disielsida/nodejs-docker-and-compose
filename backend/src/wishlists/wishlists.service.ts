import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { WishesService } from '../wishes/wishes.service';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    private wishesService: WishesService,
  ) {}

  async findAll(): Promise<Wishlist[]> {
    return this.wishlistRepository.find({
      relations: ['owner', 'items', 'items.owner'],
      order: { createdAt: 'DESC' },
    });
  }

  async create(
    createWishlistDto: CreateWishlistDto,
    user: User,
  ): Promise<Wishlist> {
    const wishes = await this.wishesService.findManyByIds(
      createWishlistDto.itemsId,
    );

    if (wishes.length !== createWishlistDto.itemsId.length) {
      throw new NotFoundException('One or more wishes not found');
    }

    const wishlist = this.wishlistRepository.create({
      name: createWishlistDto.name,
      description: createWishlistDto.description ?? '',
      image: createWishlistDto.image,
      items: wishes,
      owner: user,
    });

    return this.wishlistRepository.save(wishlist);
  }

  async findOne(id: number): Promise<Wishlist> {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id },
      relations: ['items', 'owner', 'items.owner'],
    });

    if (!wishlist) {
      throw new NotFoundException();
    }

    return wishlist;
  }

  async updateOne(wishlist: Wishlist): Promise<Wishlist> {
    return this.wishlistRepository.save(wishlist);
  }

  async updateWishlist(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    user: User,
  ): Promise<Wishlist> {
    const wishlist = await this.findOne(id);

    if (wishlist.owner.id !== user.id) {
      throw new ForbiddenException('Нельзя обновить чужой вишлист');
    }

    let wishes;

    if (updateWishlistDto.itemsId) {
      wishes = await this.wishesService.findManyByIds(
        updateWishlistDto.itemsId,
      );
      if (wishes.length !== updateWishlistDto.itemsId.length) {
        throw new NotFoundException('Один или несколько подарков не найдено');
      }
    }

    const { itemsId, ...rest } = updateWishlistDto;

    const items = itemsId ? wishes : wishlist.items;

    const newWishlist = {
      ...wishlist,
      ...rest,
      items,
    };

    return this.wishlistRepository.save(newWishlist);
  }

  async removeOne(id: number): Promise<void> {
    await this.wishlistRepository.delete(id);
  }

  async removeWishlist(id: number, user: User): Promise<Wishlist> {
    const wishlist = await this.findOne(id);

    if (wishlist.owner.id !== user.id) {
      throw new ForbiddenException('Нельзя удалить чужой вишлист');
    }

    await this.removeOne(id);

    return wishlist;
  }
}
