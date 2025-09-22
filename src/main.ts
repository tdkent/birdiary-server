import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['DELETE', 'GET', 'PATCH', 'POST', 'PUT'],
    origin: process.env.ALLOWED_ORIGINS.split(','),
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        console.error(validationErrors);
        // Return first validation exception only
        return new BadRequestException(
          validationErrors.map((error) => Object.values(error.constraints)[0]),
        );
      },
    }),
  );
  app.setGlobalPrefix('/api');
  await app.listen(process.env.PORT, () => {
    console.log('Birdiary API is listening! Port:', process.env.PORT);
  });
}
bootstrap();
