import { NestFactory, Reflector } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { config } from 'src/config';
import { rawBodyMiddleware } from './middleware';
import { AuthGuard } from './guards/auth.guard';

async function bootstrap() {
  const logger = new Logger('NestApplication');
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);

  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );
  app.enableCors();
  app.setGlobalPrefix('/api');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards(new AuthGuard(reflector));
  app.use(rawBodyMiddleware());

  await app.listen(config.port);
  logger.verbose(`Application listening on http://localhost:${config.port}`);
}
bootstrap();
