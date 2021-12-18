import { IsNotEmpty, IsOptional } from 'class-validator';
export class CreateInvoiceDto {
  @IsNotEmpty({ message: 'From name is a required field.' })
  fromName: string;

  @IsOptional()
  fromCompany: string;

  @IsOptional()
  fromAddress: string;
}
