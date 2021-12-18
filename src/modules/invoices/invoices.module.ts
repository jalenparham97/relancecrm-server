import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/modules/auth/auth.module';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { InvoiceSchemaProvider } from './models/invoice.model';
import { EmailService } from 'src/modules/email/email.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([InvoiceSchemaProvider]),
    AuthModule,
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService, EmailService],
  exports: [InvoicesService],
})
export class InvoicesModule {}
