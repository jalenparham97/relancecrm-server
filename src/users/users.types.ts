export type UserBusinessInfo = {
  businessName: string;
  website: string;
  address: string;
  branding: {
    logoUrl: string;
    color: string;
  };
  brandingSettings: {
    removeDefaultBranding: false;
  };
};

export type UserSubscriptionStatus =
  | 'active'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'past_due'
  | 'trialing'
  | 'unpaid';

export type UserSubscriptionData = {
  customerId?: string;
  status?: UserSubscriptionStatus;
  isInTrial?: boolean;
  trialEndDate?: string;
};

export type UserConnectedPayments = {
  stripe: {
    accountId: string;
    isEnabled: boolean;
  };
};
