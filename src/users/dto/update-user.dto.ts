import { PartialType } from '@nestjs/mapped-types';
import { IsObject, IsOptional } from 'class-validator';
import { Integration } from 'src/types';
import { UserConnectedPayments } from '../users.types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsObject()
  integration?: Integration;

  @IsOptional()
  @IsObject()
  connectedPayments?: UserConnectedPayments;
}
