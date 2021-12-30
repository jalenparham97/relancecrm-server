import {
  AsyncModelFactory,
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { getInitials } from 'src/utils/getInitials';
import randomColor from 'randomcolor';

@Schema({ timestamps: true })
export class Client extends Document {
  @Prop({ type: Types.ObjectId })
  userId: string;

  @Prop({ trim: true })
  firstName: string;

  @Prop({ trim: true })
  lastName: string;

  @Prop({ trim: true })
  email: string;

  @Prop({ trim: true })
  photoUrl: string;

  @Prop()
  backgroundColor: string;

  @Prop({ trim: true })
  phone: string;

  @Prop({ trim: true })
  address: string;

  @Prop({ trim: true })
  company: string;

  @Prop({ trim: true })
  website: string;

  createdAt: Date;
  updatedAt: Date;
}

export const ClientSchema = SchemaFactory.createForClass(Client);

export const ClientSchemaProvider: AsyncModelFactory = {
  name: 'Client',
  useFactory: () => {
    ClientSchema.pre<Client>('save', function (next) {
      this.backgroundColor = randomColor({ luminosity: 'dark' });
      next();
    });

    ClientSchema.virtual('fullName').get(function () {
      return `${this.firstName} ${this.lastName}`;
    });

    ClientSchema.virtual('initials').get(function () {
      return getInitials(`${this.firstName} ${this.lastName}`);
    });

    ClientSchema.set('toJSON', { virtuals: true });

    return ClientSchema;
  },
};
