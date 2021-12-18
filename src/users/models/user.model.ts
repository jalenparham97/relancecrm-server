import {
  AsyncModelFactory,
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { getInitials } from 'src/utils/getInitials';
import { Integration } from 'src/types';
import { integrationsDefault } from 'src/utils/defaultData';
import { defaultBusinessInfo } from '../users.defaultData';
import { UserBusinessInfo, UserConnectedPayments } from '../users.types';
import { SubscriptionData } from 'src/payments/payments.types';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop()
  uid: string;

  @Prop({ trim: true })
  firstName: string;

  @Prop({ trim: true })
  lastName: string;

  @Prop({ unique: true, trim: true })
  email: string;

  @Prop()
  photoUrl: string;

  @Prop({ default: ['admin'] })
  permissions: string[];

  @Prop({ type: Types.ObjectId })
  organizationId?: string;

  @Prop({ type: Array, default: integrationsDefault })
  integrations?: { [key: string]: Integration };

  @Prop({ type: Object, default: defaultBusinessInfo })
  businessInfo?: UserBusinessInfo;

  @Prop({ type: Object })
  subscription: SubscriptionData;

  @Prop({ type: Object })
  connectedPayments: UserConnectedPayments;

  fullName: string;
  initials: string;

  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

export const UserSchemaProvider: AsyncModelFactory = {
  name: 'User',
  useFactory: () => {
    UserSchema.pre<User>('save', function (next) {
      next();
    });

    UserSchema.virtual('fullName').get(function () {
      return `${this.firstName} ${this.lastName}`;
    });

    UserSchema.virtual('initials').get(function () {
      return getInitials(`${this.firstName} ${this.lastName}`);
    });

    UserSchema.set('toJSON', { virtuals: true });

    return UserSchema;
  },
};
