export type InvoiceItem = {
  _id: string;
  date: string;
  invoiceId: string;
  rate: number;
  tax: number;
  subtotal: number;
  description: string;
  units: number;
  unitsType: string;
};

export enum InvoiceTypes {
  ONE_TIME = 'one_time',
  RECURRING = 'recurring',
}

export enum InvoiceStatus {
  PAID = 'Paid',
  SENT = 'Sent',
  OVERDUE = 'Overdue',
  READ = 'Read',
  DRAFT = 'Draft',
}

export type InvoiceTemplateData = {
  subject: string;
  invoiceUrl: string;
  contentSubject: string;
  invoiceNumber: string;
  total: string;
  dueDate: string;
  message?: string;
};

export type InvoicePaymentMethod = {
  type: InvoicePaymentTypes;
  connected: boolean;
};

export type InvoicePaymentTypes = 'stripe' | 'zelle' | 'manual';

export type InvoicePaymentDetails = {
  fee?: number;
  net?: number;
  transactionId?: string;
  payerName?: string;
  paymentMethod?: InvoicePaymentTypes;
};
