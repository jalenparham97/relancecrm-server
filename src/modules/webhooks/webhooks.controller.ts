import {
  Controller,
  Post,
  Headers,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { Public } from 'src/decorators';
import { PaymentsService } from 'src/modules/payments/payments.service';
import { RequestWithRawBody } from 'src/types';
import { WebhooksService } from './webhooks.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly webhooksService: WebhooksService,
  ) {}

  @Post('stripe')
  @Public()
  async handleIncomingEvents(
    @Headers('stripe-signature') signature: string,
    @Req() request: RequestWithRawBody,
  ) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }

    try {
      const event = await this.paymentsService.constructStripeEventFromPayload(
        signature,
        request.rawBody,
      );

      console.log(event.type);

      switch (event.type) {
        case 'customer.subscription.updated':
          return await this.webhooksService.processSubscriptionUpdate(event);
        case 'account.updated' || 'account.application.authorized':
          return this.webhooksService.processStripeAccountUpdate(event);
        case 'checkout.session.completed':
          return this.webhooksService.processInvoicePaid(event);
        default:
          return;
      }
    } catch (error) {
      console.log(error);
    }
  }
}
