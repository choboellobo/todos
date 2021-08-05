import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUser } from './user.interface';
import { User } from './user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private model: Model<IUser>
  ){}
  create(createUserDto: CreateUserDto): Promise<IUser> {
    const newUser = new this.model(createUserDto);
    return newUser.save()
  }

  findAll() :Promise<IUser[]> {
    return this.model.find().exec()
  }

  findOne(id: string): Promise<IUser> {
    return this.model.findById(id).exec()
  }

  update(id: string, updateUserDto: UpdateUserDto): Promise<IUser> {
    return this.model.findByIdAndUpdate(id, updateUserDto, { new: true}).exec()
  }

  async remove(id: string) {
    await this.model.findByIdAndRemove(id).exec();
    return { status: HttpStatus.NO_CONTENT}
  }
}
