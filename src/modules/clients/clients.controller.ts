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
import { GetUser } from 'src/decorators';
import { User } from 'src/modules/users/models/user.model';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  async create(
    @Body() createClientDto: CreateClientDto,
    @GetUser() user: User,
  ) {
    return await this.clientsService.create(createClientDto, user);
  }

  @Get()
  async findAll(@GetUser() user: User) {
    return await this.clientsService.findAll(user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @GetUser() user: User) {
    return await this.clientsService.findOne(id, user);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
    @GetUser() user: User,
  ) {
    return await this.clientsService.update(id, updateClientDto, user);
  }

  @Delete()
  async removeMany(@Query('ids') ids: string[]) {
    return await this.clientsService.removeMany(ids);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @GetUser() user: User) {
    return await this.clientsService.remove(id, user);
  }
}
