import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import dayjs from 'dayjs';
import { isEmpty } from 'lodash';
import { Model } from 'mongoose';
import { config } from 'src/config';
import { EmailService } from 'src/modules/email/email.service';
import { MailOptions } from 'src/modules/email/email.types';
import { ServiceResponse } from 'src/types';
import { User } from 'src/modules/users/models/user.model';
import { formatDate, formatCurrency, omitObjProperty } from 'src/utils';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { EmailInvoiceDto } from './dto/email-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import {
  InvoicePaymentDetails,
  InvoiceStatus,
  InvoiceTemplateData,
} from './invoices.types';
import { Invoice } from './models/invoice.model';
import { padInvoiceNumber } from './utils/padInvoiceNumber';
@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel('Invoice') private invoiceModel: Model<Invoice>,
    private readonly emailService: EmailService,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto, user: User) {
    return await this.invoiceModel.create({
      userId: user._id,
      ...createInvoiceDto,
    });
  }

  async findAll(user: User) {
    const data = await this.invoiceModel
      .find({ userId: user._id })
      .sort({ createdAt: 'desc' })
      .select('_id invoiceNumber toName issuedOn dueOn total status')
      .lean()
      .exec();

    const transformedData = data.map((invoice) => {
      if (dayjs().isAfter(invoice.dueOn)) {
        const status =
          invoice.status === InvoiceStatus.DRAFT
            ? invoice.status
            : InvoiceStatus.OVERDUE;

        return { ...invoice, status };
      }
      return { ...invoice };
    });
    return { total: data.length, data: transformedData };
  }

  async findAllClientInvoices(
    clientId: string,
    user: User,
  ): Promise<ServiceResponse<Invoice>> {
    try {
      const data = await this.invoiceModel
        .find({ userId: user._id, client: clientId })
        .sort({ createdAt: 'desc' })
        .exec();
      return { total: data.length, data };
    } catch (error) {
      console.log(error);
    }
  }

  async findAllProjectInvoices(
    projectId: string,
    user: User,
  ): Promise<ServiceResponse<Invoice>> {
    try {
      const data = await this.invoiceModel
        .find({ userId: user._id, project: projectId })
        .sort({ createdAt: 'desc' })
        .exec();
      return { total: data.length, data };
    } catch (error) {
      console.log(error);
    }
  }

  async findOne(id: string, user: User) {
    const invoice = await this.invoiceModel
      .findOne({
        _id: id,
        userId: user._id,
      })
      .populate('client')
      .populate('project')
      .populate('recipients')
      .exec();

    if (!invoice) throw new NotFoundException('Invoice not found');

    const status =
      invoice.status === InvoiceStatus.DRAFT
        ? invoice.status
        : InvoiceStatus.OVERDUE;

    return dayjs().isAfter(invoice.dueOn) ? { ...invoice, status } : invoice;
  }

  async findInvoicePay(id: string) {
    const invoice = await this.invoiceModel.findById(id).lean().exec();

    if (!invoice) throw new NotFoundException('Invoice not found');

    return invoice;
  }

  async update(id: string, updateInvoiceDto: UpdateInvoiceDto, user: User) {
    try {
      let updateObject: UpdateInvoiceDto;

      if (updateInvoiceDto.invoiceNumber) {
        updateObject = {
          ...omitObjProperty(updateInvoiceDto, ['userId']),
          invoiceNumber: padInvoiceNumber(updateInvoiceDto.invoiceNumber, true),
        };
      } else {
        updateObject = {
          ...omitObjProperty(updateInvoiceDto, ['userId']),
        };
      }

      return await this.invoiceModel
        .findOneAndUpdate({ _id: id, userId: user._id }, updateObject, {
          new: true,
        })
        .lean()
        .exec();
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Invoice not found');
    }
  }

  async updateInvoicePaid(id: string, paymentDetails: InvoicePaymentDetails) {
    try {
      return await this.invoiceModel
        .findByIdAndUpdate(
          id,
          {
            status: InvoiceStatus.PAID,
            paymentDate: dayjs().toISOString(),
            paymentDetails: { ...paymentDetails, paymentMethod: 'stripe' },
          },
          {
            new: true,
          },
        )
        .lean()
        .exec();
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Invoice not found');
    }
  }

  async removeInvoiceProject(id: string, user: User) {
    try {
      const invoice = await this.invoiceModel
        .findOneAndUpdate(
          { _id: id, userId: user._id },
          { $unset: { project: '' } },
          { new: true },
        )
        .lean()
        .exec();
      return invoice;
    } catch (error) {}
  }

  async removeMany(ids: string[]) {
    try {
      await this.invoiceModel.deleteMany({ _id: { $in: ids } });
    } catch (error) {
      throw new NotFoundException('Invoices not found');
    }
  }

  async remove(id: string, user: User) {
    try {
      return await this.invoiceModel.findOneAndRemove({
        _id: id,
        userId: user._id,
      });
    } catch (error) {
      throw new NotFoundException('Invoice not found');
    }
  }

  async sendTestInvoiceEmail(emailInvoiceDto: EmailInvoiceDto, user: User) {
    try {
      const isTest = { isTest: true };
      const email = this.createInvoiceEmail(emailInvoiceDto, user, isTest);
      await this.emailService.send(email);
    } catch (error) {
      console.log(error);
      if (error.code === HttpStatus.BAD_REQUEST) {
        throw new BadRequestException();
      }
    }
  }

  async sendInvoiceEmail(emailInvoiceDto: EmailInvoiceDto, user: User) {
    try {
      const { invoice } = emailInvoiceDto;
      const email = this.createInvoiceEmail(emailInvoiceDto, user);
      await this.emailService.send(email);
      await this.updateInvoiceStatus(invoice, user);
    } catch (error) {
      console.log(error.response.body);
      if (error.code === HttpStatus.BAD_REQUEST) {
        throw new BadRequestException();
      }
    }
  }

  private createInvoiceEmail(
    eInvoiceDto: EmailInvoiceDto,
    user: User,
    test: { isTest: boolean } = { isTest: false },
  ) {
    const { invoice, sendUserCopy, message, recipients, from } = eInvoiceDto;
    const { isTest } = test;

    const isTestHeader = isTest ? 'Your test email:' : '';

    const dynamicTemplateData: InvoiceTemplateData = {
      subject: `${isTestHeader} ${from} sent you an invoice`,
      invoiceUrl: `${config.webAppURL}/invoices/${invoice._id}/pay`,
      contentSubject: `${from} sent you an invoice`,
      invoiceNumber: `${invoice.invoiceNumber}`,
      total: formatCurrency(invoice.total),
      dueDate: formatDate(invoice.dueOn),
      message,
    };

    const email: MailOptions = {
      from: `${from} <${config.email.emailFrom}>`,
      templateId: config.email.invoiceTestTemplateId,
      dynamicTemplateData,
    };

    if (isTest) {
      email.to = [user.email];
    } else {
      email.to = [invoice.toEmail];
      email.cc = !isEmpty(recipients) ? [...recipients] : [];
      email.bcc = sendUserCopy ? [user.email] : [];
    }

    return email;
  }

  private async updateInvoiceStatus(invoice: Invoice, user: User) {
    return await this.invoiceModel
      .findOneAndUpdate(
        { _id: invoice._id, userId: user._id },
        { status: InvoiceStatus.SENT },
        {
          new: true,
        },
      )
      .lean()
      .exec();
  }

  private calculatePaymentFee(amount: number) {
    const paymentAmount = Number(amount);
    const total = (paymentAmount + 0.3) / (1 - 2.9 / 100);
    // const fee = total -
    return total;
  }
}
