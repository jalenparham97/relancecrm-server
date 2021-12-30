import {
  AsyncModelFactory,
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class WebhookEvent extends Document {
  @Prop()
  _id: string;

  createdAt: Date;
  updatedAt: Date;
}

export const WebhookEventSchema = SchemaFactory.createForClass(WebhookEvent);

export const WebhookEventSchemaProvider: AsyncModelFactory = {
  name: 'WebhookEvent',
  useFactory: () => {
    return WebhookEventSchema;
  },
};
