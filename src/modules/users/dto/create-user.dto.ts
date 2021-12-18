import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { SubscriptionData } from 'src/modules/payments/payments.types';

export class CreateUserDto {
  @IsNotEmpty({ message: 'First name is required.' })
  firstName: string;

  @IsNotEmpty({ message: 'First name is required.' })
  lastName: string;

  @IsNotEmpty({ message: 'Email address is required.' })
  @IsEmail({}, { message: 'Please provide a valid email address.' })
  email: string;

  @IsNotEmpty()
  uid: string;

  @IsOptional()
  photoUrl: string;

  @IsOptional()
  subscription?: SubscriptionData;
}
