import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoicesModule } from 'src/modules/invoices/invoices.module';
import { InvoicesService } from 'src/modules/invoices/invoices.service';
import { PaymentsService } from 'src/modules/payments/payments.service';
import { UsersModule } from 'src/modules/users/users.module';
import { WebhookEventSchemaProvider } from './models/webhook-event.model';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([WebhookEventSchemaProvider]),
    UsersModule,
    InvoicesModule,
  ],
  controllers: [WebhooksController],
  providers: [WebhooksService, PaymentsService],
})
export class WebhooksModule {}
