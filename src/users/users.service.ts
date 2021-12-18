import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubscriptionData } from 'src/payments/payments.types';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './models/user.model';
import { UserConnectedPayments } from './users.types';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    return await this.userModel.create(createUserDto);
  }

  async findAll() {
    return this.userModel.find();
  }

  async findOne(id: string) {
    return await this.userModel.findById(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.userModel
      .findByIdAndUpdate(id, updateUserDto, {
        new: true,
      })
      .exec();
  }

  async updateStripeConnectedPayment(id: string, accountId: string) {
    const update = { connectPayments: { stripe: { accountId } } };
    return await this.userModel
      .findByIdAndUpdate(id, update, { new: true })
      .exec();
  }

  // async updateStripeConnectedPayment(
  //   id: string,
  //   stripeConnectedPayment: { accountId?: string; isConnected?: boolean }
  // ) {
  //   const { accountId } = stripeConnectedPayment;
  //   return await this.userModel
  //     .findByIdAndUpdate(
  //       id,
  //       { connectPayments: { stripe: { accountId } } },
  //       {
  //         new: true,
  //       }
  //     )
  //     .lean()
  //     .exec();
  // }

  async updateSubscription(subscription: SubscriptionData) {
    return this.userModel
      .findOneAndUpdate(
        {
          'subscription.customerId': subscription.customerId,
        },
        {
          'subscription.status': subscription.status,
          'subscription.isInTrial': subscription.isInTrial,
          'subscription.plan': subscription.plan,
        },
        { new: true }
      )
      .exec();
  }

  async updateIntegration(id: string, updateUserDto: UpdateUserDto) {
    const { authId, isConnected, name } = updateUserDto.integration;
    const integration = `integrations.${name}`;
    return await this.userModel
      .findByIdAndUpdate(
        id,
        {
          $set: { [integration]: { authId, isConnected } },
        },
        { new: true }
      )
      .exec();
  }

  async remove(id: string) {
    return await this.userModel.findByIdAndDelete(id);
  }
}
