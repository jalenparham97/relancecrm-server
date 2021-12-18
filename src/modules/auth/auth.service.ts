import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { SignupCredentialsDto } from './dto/signup-credentials.dto';
import { PaymentsService } from 'src/modules/payments/payments.service';
import { formatDate } from 'src/utils/formatters/formatDate';
import { UsersService } from 'src/modules/users/users.service';
import { config } from 'src/config';
import dayjs from 'dayjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private paymentsService: PaymentsService,
  ) {}

  async signUp(signupCredentialsDto: SignupCredentialsDto) {
    try {
      const plan = signupCredentialsDto.plan || 'Free';
      // const configPlan = plan.toLowerCase();
      const customer = await this.paymentsService.createStripeCustomer({
        email: signupCredentialsDto.email,
      });
      const subscription = await this.paymentsService.createSubscription(
        customer.id,
        plan,
      );
      return await this.usersService.create({
        ...signupCredentialsDto,
        subscription: {
          customerId: customer.id,
          plan,
          status: subscription.status,
        },
      });
    } catch (error) {
      console.log(error);
      if (error.code === 11000) {
        throw new ConflictException('User already exists');
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
