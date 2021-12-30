import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/modules/users/models/user.model';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './models/client.model';

@Injectable()
export class ClientsService {
  constructor(@InjectModel('Client') private clientModel: Model<Client>) {}

  async create(createClientDto: CreateClientDto, user: User) {
    return await this.clientModel.create({
      userId: user._id,
      ...createClientDto,
    });
  }

  async findAll(user: User) {
    const data = await this.clientModel
      .find({ userId: user._id })
      .sort({ createdAt: 'desc' })
      .limit(20)
      .exec();
    return { total: data.length, data };
  }

  async findOne(id: string, user: User) {
    const client = await this.clientModel.findOne({
      _id: id,
      userId: user._id,
    });

    if (!client) throw new NotFoundException('Client not found');

    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto, user: User) {
    try {
      return await this.clientModel
        .findOneAndUpdate({ _id: id, userId: user._id }, updateClientDto)
        .lean();
    } catch (error) {
      throw new NotFoundException('Client not found');
    }
  }

  async removeMany(ids: string[]) {
    try {
      await this.clientModel.deleteMany({ _id: { $in: ids } });
    } catch (error) {
      throw new NotFoundException('Clients not found');
    }
  }

  async remove(id: string, user: User) {
    try {
      return await this.clientModel.findOneAndRemove({
        _id: id,
        userId: user._id,
      });
    } catch (error) {
      throw new NotFoundException('Client not found');
    }
  }
}
