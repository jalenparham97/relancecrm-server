import { IsNotEmpty } from 'class-validator';
import { InvoiceItem } from 'src/modules/invoices/invoices.types';

export class InvoicePaymentDto {
  @IsNotEmpty()
  stripeAccountId: string;

  @IsNotEmpty({ message: 'Invoice id is required.' })
  invoiceId: string;

  @IsNotEmpty()
  lineItems: InvoiceItem[];
}
