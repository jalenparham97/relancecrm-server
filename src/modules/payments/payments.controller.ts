import { Body, Controller, Get, Post } from '@nestjs/common';
import { Public, GetUser } from 'src/decorators';
import { User } from 'src/modules/users/models/user.model';
import { InvoicePaymentDto } from './dto/invoice-payment.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('/connect/stripe')
  async createStripeConnectSession(@GetUser() user: User) {
    return await this.paymentsService.createStripeConnectSession(user);
  }

  @Post('/checkout')
  async createCheckoutSession(@GetUser() user: User) {
    return await this.paymentsService.createCheckoutSession(user);
  }

  @Post('/billing')
  async createBillingPortalSession(@GetUser() user: User) {
    return await this.paymentsService.createBillingPortalSession(user);
  }

  @Post('/billing/update')
  async createBillingPortalUpdateSession(@GetUser() user: User) {
    return await this.paymentsService.createBillingPortalUpdateSession(user);
  }

  @Post('/invoice/checkout')
  @Public()
  async createInvoiceCheckoutSession(
    @Body() invoicePaymentDto: InvoicePaymentDto,
  ) {
    return await this.paymentsService.createInvoiceCheckoutSession(
      invoicePaymentDto,
    );
  }
}
