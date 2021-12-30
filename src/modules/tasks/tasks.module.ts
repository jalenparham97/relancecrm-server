import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { AuthModule } from 'src/modules/auth/auth.module';
import { TaskSchemaProvider } from './models/task.model';

@Module({
  imports: [MongooseModule.forFeatureAsync([TaskSchemaProvider]), AuthModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
