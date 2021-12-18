import { DynamicModule, Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FirebaseStrategy } from './firebase-auth.strategy';
import { FirebaseAuthConfig } from './firebase-auth.types';
import { FIREBASE_AUTH_CONFIG } from './firebase-auth.constants';
import { UserSchemaProvider } from 'src/modules/users/models/user.model';

@Global()
@Module({})
export class FirebaseAuthModule {
  static register(firebaseAuthConfig: FirebaseAuthConfig): DynamicModule {
    return {
      module: FirebaseAuthModule,
      imports: [MongooseModule.forFeatureAsync([UserSchemaProvider])],
      providers: [
        {
          provide: FIREBASE_AUTH_CONFIG,
          useValue: firebaseAuthConfig,
        },
        FirebaseStrategy,
      ],
      exports: [FirebaseStrategy, FIREBASE_AUTH_CONFIG],
    };
  }
}
