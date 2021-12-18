import dotenv from 'dotenv';
import { SubscriptionPlan } from 'src/modules/payments/payments.types';

dotenv.config();

export const config = {
  firebase: {
    apiKey: process.env.FIREBASE_API_KEY,
    audience: process.env.FIREBASE_AUDIENCE,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    issuer: process.env.FIREBASE_ISSUER,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    projectId: process.env.FIREBASE_PROJECT_ID,
  },
  database: {
    uri: process.env.DB_URI,
    serverlessUri: process.env.SERVERLESS_DB_URI,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  stripe: {
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    secretKey: process.env.STRIPE_SECRET_KEY,
    plans: {
      pro: {
        id: process.env.PRO_PLAN_ID,
        trialDays: 14,
        name: 'Pro' as SubscriptionPlan,
      },
      free: {
        id: process.env.FREE_PLAN_ID,
        trialDays: 'now',
        name: 'Free' as SubscriptionPlan,
      },
    },
  },
  email: {
    emailApiKey: process.env.EMAIL_API_KEY,
    emailFrom: 'notifications@relancecrm.com',
    invoiceTestTemplateId: 'd-cb5c1bca499649d3b6e8472282069b49',
  },
  webAppURL: process.env.WEB_APP_URL,
  jkwsUri: process.env.JWKS_URI,
  port: process.env.PORT || 5000,
  pizzlySecretKey: process.env.PIZZLY_SECRET_KEY,
};
