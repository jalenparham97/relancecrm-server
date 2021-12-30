import { Request } from 'express';
import Stripe from 'stripe';

// File exports
export * from './paginationParams';

export type ServiceResponse<T> = {
  data: T[];
  limit?: number;
  skip?: number;
  total: number;
  nextId?: string;
};

export type StripeCustomer = Stripe.CustomerCreateParams;

export interface RequestWithRawBody extends Request {
  rawBody: Buffer;
}
