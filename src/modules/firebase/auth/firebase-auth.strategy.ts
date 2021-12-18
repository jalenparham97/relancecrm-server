import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DecodedIdToken, FirebaseAuthConfig } from './firebase-auth.types';
import {
  FIREBASE_AUTH_CONFIG,
  FIREBASE_STRATEGY,
} from './firebase-auth.constants';
import { User } from 'src/modules/users/models/user.model';
import { config } from 'src/config';

@Injectable()
export class FirebaseStrategy extends PassportStrategy(
  Strategy,
  FIREBASE_STRATEGY,
) {
  constructor(
    @Inject(FIREBASE_AUTH_CONFIG) { issuer, audience }: FirebaseAuthConfig,
    @InjectModel('User') private userModel: Model<User>,
  ) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksUri: config.jkwsUri,
      }),
      issuer,
      audience,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: DecodedIdToken) {
    const { email } = payload;
    const user = await this.userModel.findOne({ email }).lean();

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
