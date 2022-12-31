import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { IsMongodbObjectIdPipe } from 'src/common/pipes';
import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from './entities';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':userId')
  findOne(@Param('userId', IsMongodbObjectIdPipe) userId: string) {
    return this.usersService.findOne(userId);
  }

  @Patch(':userId')
  update(
    @Param('userId', IsMongodbObjectIdPipe) userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(userId, updateUserDto);
  }

  @Delete(':userId')
  remove(
    @Param('userId', IsMongodbObjectIdPipe) userId: string,
  ): Promise<User> {
    return this.usersService.remove(userId);
  }

  @Post(':userId')
  @HttpCode(HttpStatus.OK)
  recommendUser(
    @Param('userId', IsMongodbObjectIdPipe) userId: string,
  ): Promise<User> {
    return this.usersService.recommendUser(userId);
  }
}
