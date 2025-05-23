import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { port } from './common/constants/env.constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      //? Optional: Extract the first validation error message
      // exceptionFactory: (validationErrors: ValidationError[] = []) => {
      //   return new BadRequestException(
      //     validationErrors.map((error) => Object.values(error.constraints)[0]),
      //   );
      // },
    }),
  );
  app.setGlobalPrefix('/api');
  await app.listen(port, () => {
    console.log('Birdiary API is listening! Port:', port);
  });
}
bootstrap();
