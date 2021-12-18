import { UserBusinessInfo } from './users.types';

export const defaultBusinessInfo: UserBusinessInfo = {
  businessName: '',
  website: '',
  address: '',
  branding: {
    logoUrl: '',
    color: '',
  },
  brandingSettings: {
    removeDefaultBranding: false,
  },
};
