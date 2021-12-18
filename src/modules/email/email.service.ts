import { Injectable } from '@nestjs/common';
import sgMail from '@sendgrid/mail';
import { config } from 'src/config';
import { Mailer, MailOptions } from './email.types';

@Injectable()
export class EmailService {
  private mailer: Mailer = sgMail;

  constructor() {
    this.mailer.setApiKey(config.email.emailApiKey);
  }

  async send(mailOptions: MailOptions) {
    return await this.mailer.send(mailOptions);
  }
}
