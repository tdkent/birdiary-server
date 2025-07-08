import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { PORT } from 'src/common/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
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
  await app.listen(PORT, () => {
    console.log('Birdiary API is listening! Port:', PORT);
  });
}
bootstrap();
