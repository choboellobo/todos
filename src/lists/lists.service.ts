import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { IList } from './list.interface';
import { List } from './lists.schema';

@Injectable()
export class ListsService {

  constructor(
    @InjectModel(List.name) private model: Model<IList>
  ){}

  create(ownerId: string, createListDto: CreateListDto) {
    const newList = new this.model({...createListDto, owner: ownerId});
    return newList.save()
  }

  findAll(query?: Object) {
    return this.model.find(query)
  }

  findOne(id: string) {
    return this.model.findById(id)
  }

  update(id: string, updateListDto: UpdateListDto) {
    return this.model.findByIdAndUpdate(id, updateListDto, { new: true})
  }

  async remove(id: string) {
    await this.model.findByIdAndRemove(id).exec();
    return { status: HttpStatus.NO_CONTENT}
  }

  async syncListWithMe(id: string, me: string) {
    return this.model.findByIdAndUpdate(id, { $addToSet: {allows: me }}, {new: true})
  }
}
