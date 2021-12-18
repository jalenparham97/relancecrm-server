import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupCredentialsDto } from './dto/signup-credentials.dto';
import { User } from 'src/modules/users/models/user.model';
import { Public, GetUser } from 'src/decorators';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/authenticate')
  async authenticate(@GetUser() user: User) {
    return user;
  }

  @Post('/signup')
  @Public()
  async signUp(@Body() signupCredetialsDto: SignupCredentialsDto) {
    return await this.authService.signUp(signupCredetialsDto);
  }
}
