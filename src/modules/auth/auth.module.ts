import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserSchemaProvider } from 'src/modules/users/models/user.model';
import { FirebaseAuthModule } from '../firebase/auth/firebase-auth.module';
import { FirebaseStrategy } from '../firebase/auth/firebase-auth.strategy';
import { FIREBASE_STRATEGY } from '../firebase/auth/firebase-auth.constants';
import { config } from 'src/config';
import { PaymentsService } from 'src/modules/payments/payments.service';
import { UsersService } from 'src/modules/users/users.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([UserSchemaProvider]),
    PassportModule.register({ defaultStrategy: FIREBASE_STRATEGY }),
    FirebaseAuthModule.register({
      audience: config.firebase.audience,
      issuer: config.firebase.issuer,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PaymentsService, UsersService, FirebaseStrategy],
  exports: [AuthService, FirebaseStrategy, PassportModule],
})
export class AuthModule {}
