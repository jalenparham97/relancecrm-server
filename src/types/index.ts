import { Request } from 'express';
import Stripe from 'stripe';

export type ServiceResponse<T> = {
  data: T[];
  limit?: number;
  skip?: number;
  total: number;
};

export type StripeCustomer = Stripe.CustomerCreateParams;

export interface RequestWithRawBody extends Request {
  rawBody: Buffer;
}
