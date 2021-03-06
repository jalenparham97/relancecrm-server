export type SubscriptionData = {
  customerId?: string;
  plan: SubscriptionPlan;
  status?: SubscriptionStatus;
  isInTrial?: boolean;
  trialEndDate?: string;
};

export type SubscriptionStatus =
  | 'active'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'past_due'
  | 'trialing'
  | 'unpaid';

export type SubscriptionPlan = 'Free' | 'Pro';

export enum SubscriptionPlans {
  FREE = 'Free',
  PRO = 'Pro',
}
