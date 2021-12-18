import { config } from 'src/config';
import { ServiceAccount } from 'firebase-admin';

export const serviceAccount: ServiceAccount = {
  projectId: config.firebase.projectId,
  clientEmail: config.firebase.clientEmail,
  privateKey: config.firebase.privateKey,
};
