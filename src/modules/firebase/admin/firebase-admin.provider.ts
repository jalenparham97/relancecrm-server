import { FirebaseAdminModuleAsyncOptions } from './firebase-admin.types';
import admin from 'firebase-admin';
import { serviceAccount } from './firebase-admin.config';

export const FirebaseAdminProvider: FirebaseAdminModuleAsyncOptions = {
  useFactory: () => ({
    credential: admin.credential.cert(serviceAccount),
  }),
};
