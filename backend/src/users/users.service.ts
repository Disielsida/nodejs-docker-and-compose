import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, ILike } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { WishesService } from '../wishes/wishes.service';
import { Wish } from '../wishes/entities/wish.entity';
import { FindUserDto } from './dto/find-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private wishesService: WishesService,
  ) {}

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['wishes', 'wishlists', 'offers'],
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }

  async updateOne(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async updateUser(user: User, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.password) {
      const saltRounds = 10;
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        saltRounds,
      );
    }

    return this.updateOne({ ...user, ...updateUserDto });
  }

  async findOwnWishes(user: User): Promise<Wish[]> {
    return this.wishesService.findManyByOwnerId(user.id);
  }

  async findOneByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }

  async findPublicWishes(username: string, user: User): Promise<Wish[]> {
    const { id } = await this.findOneByUsername(username);

    return this.wishesService.findManyWishes(id, user);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    );

    return this.userRepository.save({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  async findMany(
    where: FindOptionsWhere<User> | FindOptionsWhere<User>[],
  ): Promise<User[]> {
    return this.userRepository.find({ where });
  }

  async findManyByEmailOrUsername(findUserDto: FindUserDto): Promise<User[]> {
    const { query } = findUserDto;

    const users = await this.findMany([
      { email: ILike(`%${query}%`) },
      { username: ILike(`%${query}%`) },
    ]);

    if (!users.length) {
      throw new NotFoundException('Пользователи не найден');
    }

    return users;
  }
}
