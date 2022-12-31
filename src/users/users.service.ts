import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from './entities';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const createdUser = await this.userModel.create(createUserDto);

      return createdUser.save();
    } catch (err) {
      if (err.code === 11000)
        throw new BadRequestException(
          'The given credentials are already taken.',
        );

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

      if (!foundUser) throw new NotFoundException(`User #${userId} not found`);

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
      const user = await this.findOne(userId);
      return user.remove();
    } catch (err) {
      throw err;
    }
  }

  async recommendUser(userId: string): Promise<User> {
    const user = await this.findOne(userId);

    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      user.recommendations++;

      const recommendEvent = new this.eventModel({
        name: 'recommend_user',
        type: 'user',
        payload: { userId: user._id },
      });

      recommendEvent.save({ session });
      user.save({ session });

      await session.commitTransaction();

      return user;
    } catch (err) {
      await session.abortTransaction();
    } finally {
      await session.endSession();
    }
  }
}
