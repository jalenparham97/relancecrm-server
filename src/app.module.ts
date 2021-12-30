import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { config } from './config';
import { AuthModule } from './modules/auth/auth.module';
import { ClientsModule } from './modules/clients/clients.module';
import { EmailModule } from './modules/email/email.module';
import { FirebaseAdminModule } from './modules/firebase/admin/firebase-admin.module';
import { FirebaseAdminProvider } from './modules/firebase/admin/firebase-admin.provider';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { UsersModule } from './modules/users/users.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';

@Module({
  imports: [
    MongooseModule.forRoot(config.database.uri),
    FirebaseAdminModule.forRootAsync(FirebaseAdminProvider),
    AuthModule,
    UsersModule,
    ClientsModule,
    // ProjectsModule,
    TasksModule,
    InvoicesModule,
    PaymentsModule,
    WebhooksModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
