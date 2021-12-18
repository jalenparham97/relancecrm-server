import { PartialType } from '@nestjs/mapped-types';
import { IsOptional } from 'class-validator';
import { InvoiceStatus } from '../invoices.types';
import { CreateInvoiceDto } from './create-invoice.dto';

export class UpdateInvoiceDto extends PartialType(CreateInvoiceDto) {
  @IsOptional()
  invoiceNumber?: string;

  @IsOptional()
  recipients?: string[];

  @IsOptional()
  status?: InvoiceStatus;
}
