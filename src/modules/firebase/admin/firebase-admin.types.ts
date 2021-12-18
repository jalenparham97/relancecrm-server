import { ModuleMetadata } from '@nestjs/common/interfaces';
import admin from 'firebase-admin';

export type FirebaseAdminApp = admin.app.App;

export type FirebaseUser = admin.auth.DecodedIdToken;

export interface FirebaseAdminModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  useFactory?: (...args: any[]) => Promise<admin.AppOptions> | admin.AppOptions;
  inject?: any[];
}
