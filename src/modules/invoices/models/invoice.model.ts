import {
  AsyncModelFactory,
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import {
  InvoiceItem,
  InvoicePaymentDetails,
  InvoicePaymentMethod,
  InvoiceStatus,
  InvoiceTypes,
} from '../invoices.types';
import { padInvoiceNumber } from '../utils/padInvoiceNumber';
import dayjs from 'dayjs';

@Schema({ timestamps: true })
export class Invoice extends Document {
  @Prop({ type: Types.ObjectId })
  userId: string;

  @Prop({ default: 0 })
  amountDue: number;

  @Prop({ default: 0 })
  amountPaid: number;

  @Prop({ default: 0 })
  subtotal: number;

  @Prop({ default: 0 })
  total: number;

  @Prop({ default: 0 })
  tax: number;

  @Prop({ default: 0 })
  discount: number;

  @Prop({ type: Object, default: 'Tax' })
  taxLabel: string;

  @Prop({ default: '' })
  sentDate: string;

  @Prop()
  issuedOn: string;

  @Prop()
  dueOn: string;

  @Prop()
  invoiceNumber: string;

  @Prop({ default: InvoiceStatus.DRAFT })
  status: InvoiceStatus;

  @Prop({ type: String, default: InvoiceTypes.ONE_TIME })
  type: InvoiceTypes;

  @Prop({ trim: true, default: '' })
  fromCompany: string;

  @Prop({ trim: true, default: '' })
  fromAddress: string;

  @Prop({ trim: true, default: '' })
  fromName: string;

  @Prop({ trim: true, default: '' })
  toAddress: string;

  @Prop({ trim: true, default: '' })
  toCompany: string;

  @Prop({ trim: true, default: '' })
  toEmail: string;

  @Prop({ trim: true, default: '' })
  toName: string;

  @Prop({ type: Array, default: [] })
  items: InvoiceItem[];

  @Prop({ default: '' })
  notes: string;

  @Prop({ type: Types.ObjectId, ref: 'Project' })
  project: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Client' }], default: [] })
  recipients: string[];

  @Prop({ type: Types.ObjectId, ref: 'Client' })
  client: string;

  @Prop({ type: Array, default: [] })
  paymentMethods: InvoicePaymentMethod[];

  @Prop()
  paymentDate: string;

  @Prop({ type: Object, default: {} })
  paymentDetails: InvoicePaymentDetails;

  createdAt: Date;
  updatedAt: Date;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);

export const InvoiceSchemaProvider: AsyncModelFactory = {
  name: 'Invoice',
  useFactory: () => {
    InvoiceSchema.set('toJSON', { virtuals: true });

    InvoiceSchema.pre<Invoice>('save', async function (next) {
      const invoices = await this.collection
        .find({ userId: this.userId })
        .sort({ createdAt: 1 })
        .toArray();
      const lastInvoiceNumber = invoices.length
        ? invoices[invoices.length - 1]?.invoiceNumber
        : '0';
      this.invoiceNumber = padInvoiceNumber(lastInvoiceNumber);
      this.issuedOn = dayjs().toISOString();
      this.dueOn = dayjs(this.issuedOn).add(1, 'month').toISOString();
      next();
    });

    return InvoiceSchema;
  },
};
