import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { GetUser, Public } from 'src/decorators';
import { User } from 'src/modules/users/models/user.model';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { EmailInvoiceDto } from './dto/email-invoice.dto';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  async create(
    @Body() createInvoiceDto: CreateInvoiceDto,
    @GetUser() user: User,
  ) {
    return await this.invoicesService.create(createInvoiceDto, user);
  }

  @Get()
  async findAll(@GetUser() user: User) {
    return await this.invoicesService.findAll(user);
  }

  @Get('client')
  async findAllClientInvoices(
    @Query('clientId') clientId: string,
    @GetUser() user: User,
  ) {
    return await this.invoicesService.findAllClientInvoices(clientId, user);
  }

  @Get('project')
  async findAllProjectInvoices(
    @Query('projectId') projectId: string,
    @GetUser() user: User,
  ) {
    return await this.invoicesService.findAllProjectInvoices(projectId, user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @GetUser() user: User) {
    return await this.invoicesService.findOne(id, user);
  }

  @Get(':id/pay')
  @Public()
  async findInvoicePay(@Param('id') id: string) {
    return await this.invoicesService.findInvoicePay(id);
  }

  @Post('send/test')
  async sendTestInvoiceEmail(
    @Body() emailInvoiceDto: EmailInvoiceDto,
    @GetUser() user: User,
  ) {
    return await this.invoicesService.sendTestInvoiceEmail(
      emailInvoiceDto,
      user,
    );
  }

  @Post('send')
  async sendInvoiceEmail(
    @Body() emailInvoiceDto: EmailInvoiceDto,
    @GetUser() user: User,
  ) {
    return await this.invoicesService.sendInvoiceEmail(emailInvoiceDto, user);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
    @GetUser() user: User,
  ) {
    return await this.invoicesService.update(id, updateInvoiceDto, user);
  }

  @Patch(':id/project')
  async removeInvoiceProject(@Param('id') id: string, @GetUser() user: User) {
    return await this.invoicesService.removeInvoiceProject(id, user);
  }

  @Delete()
  async removeMany(@Query('ids') ids: string[]) {
    return await this.invoicesService.removeMany(ids);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @GetUser() user: User) {
    return await this.invoicesService.remove(id, user);
  }
}
