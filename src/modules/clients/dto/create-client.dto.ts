import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateClientDto {
  @IsNotEmpty({ message: 'First name is a required.' })
  firstName: string;

  @IsNotEmpty({ message: 'Last name is a required field.' })
  lastName: string;

  @IsNotEmpty({ message: 'Email is a required field.' })
  @IsEmail()
  email: string;

  @IsOptional()
  phone: string;

  @IsOptional()
  company: string;

  @IsOptional()
  website: string;

  @IsOptional()
  address: string;
}
