import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class LoginCredentialsDto {
  @IsNotEmpty({ message: 'Email address is required.' })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'Password is required.' })
  @MinLength(6)
  @MaxLength(20)
  password: string;
}
