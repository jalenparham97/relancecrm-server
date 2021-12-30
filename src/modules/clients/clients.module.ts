import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/modules/auth/auth.module';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { ClientSchemaProvider } from './models/client.model';

@Module({
  imports: [MongooseModule.forFeatureAsync([ClientSchemaProvider]), AuthModule],
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule {}
