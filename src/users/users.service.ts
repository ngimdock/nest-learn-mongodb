import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from './entities';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const createdUser = await this.userModel.create(createUserDto);

      return createdUser.save();
    } catch (err) {
      throw err;
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return this.userModel.find().exec();
    } catch (err) {
      throw err;
    }
  }

  async findOne(userId: string): Promise<User> {
    try {
      const foundUser = await this.userModel.findOne({ _id: userId }).exec();

      if (!foundUser) throw new NotFoundException(`User #${userId} not found.`);

      return foundUser;
    } catch (err) {
      throw err;
    }
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const existingUser = await this.userModel
        .findOneAndUpdate(
          { _id: userId },
          { $set: updateUserDto },
          { new: true },
        )
        .exec();

      if (!existingUser)
        throw new NotFoundException(`User #${userId} not found`);

      return existingUser;
    } catch (err) {
      throw err;
    }
  }

  async remove(userId: string): Promise<User> {
    try {
      const user = await this.userModel.findById(userId);

      if (!user) throw new NotFoundException(`User #${userId} not found.`);

      return user.remove();
    } catch (err) {
      throw err;
    }
  }
}
