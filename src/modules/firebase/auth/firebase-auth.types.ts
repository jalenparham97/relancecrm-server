import admin from 'firebase-admin';

export interface FirebaseAuthConfig {
  issuer: string;
  audience: string;
}

export type DecodedIdToken = admin.auth.DecodedIdToken;
