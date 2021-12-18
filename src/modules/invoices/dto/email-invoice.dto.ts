import { IsNotEmpty, IsObject, IsOptional } from 'class-validator';
import { Invoice } from '../models/invoice.model';

export class EmailInvoiceDto {
  // @IsNotEmpty({ message: 'Invoice number is required.' })
  @IsOptional()
  invoiceNumber: string;

  // @IsNotEmpty({ message: 'Total is a required.' })
  @IsOptional()
  total: string;

  // @IsNotEmpty({ message: 'Due date is required.' })
  @IsOptional()
  dueDate: string;

  @IsOptional()
  from: string;

  @IsOptional()
  contentSubject: string;

  @IsOptional()
  subject: string;

  @IsOptional()
  message: string;

  @IsOptional()
  sendUserCopy: boolean;

  @IsOptional()
  recipients: string[];

  @IsObject()
  invoice: Invoice;
}
