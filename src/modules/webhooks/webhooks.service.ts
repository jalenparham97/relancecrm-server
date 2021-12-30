import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Stripe from 'stripe';
import { config } from 'src/config';
import { formatToDollars } from 'src/utils';
import { WebhookEvent } from './models/webhook-event.model';
import { UsersService } from 'src/modules/users/users.service';
import { SubscriptionData } from 'src/modules/payments/payments.types';
import { PaymentsService } from 'src/modules/payments/payments.service';
import { InvoicesService } from 'src/modules/invoices/invoices.service';

@Injectable()
export class WebhooksService {
  constructor(
    @InjectModel('WebhookEvent') private webhookEventModel: Model<WebhookEvent>,
    private usersService: UsersService,
    private invoicesService: InvoicesService,
    private paymentsService: PaymentsService,
  ) {}

  async createEvent(id: string) {
    return await this.webhookEventModel.create({ _id: id });
  }

  async processSubscriptionUpdate(event: Stripe.Event) {
    try {
      await this.createEvent(event.id);
    } catch (error) {
      if (error) {
        throw new BadRequestException('This event was already processed');
      }
    }

    const data = event.data.object as Stripe.Subscription;
    const customerId = data.customer as string;
    const status = data.status;
    const planId = data.items.data[0].price.id;
    const plans = Object.values(config.stripe.plans);

    const subscription: SubscriptionData = {
      customerId,
      status,
      isInTrial: data.status === 'trialing',
      plan: plans.find((plan) => plan.id === planId).name,
    };

    await this.usersService.updateSubscription(subscription);
  }

  async processStripeAccountUpdate(event: Stripe.Event) {
    try {
      await this.createEvent(event.id);
    } catch (error) {
      if (error) {
        throw new BadRequestException('This event was already processed');
      }
    }

    const account = event.data.object as Stripe.Account;
    console.log(account.details_submitted);
    console.log(account);

    // await this.usersService.updateStripeConnectedPaymentWebhook(account.id, {
    //   isConnected: true,
    // });
  }

  async processInvoicePaid(event: Stripe.Event) {
    try {
      await this.createEvent(event.id);
    } catch (error) {
      if (error) {
        throw new BadRequestException('This event was already processed');
      }
    }
    const data = event.data.object as Stripe.Checkout.Session;
    const invoiceId = data.metadata.invoiceId;
    const stripeAccountId = data.metadata.stripeAccountId;
    const paymentId = data.payment_intent as string;

    const payment = await this.paymentsService.getStripeAccountPayment(
      paymentId,
      stripeAccountId,
    );

    const balance = payment.charges.data[0]
      .balance_transaction as Stripe.BalanceTransaction;

    const fee = formatToDollars(balance.fee);
    const net = formatToDollars(balance.net);
    const transactionId = balance.source as string;

    return await this.invoicesService.updateInvoicePaid(invoiceId, {
      fee,
      net,
      transactionId,
    });
  }
}
