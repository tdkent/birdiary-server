import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { BirdModule } from './bird/bird.module';
import { BirdController } from './bird/bird.controller';
import { BirdService } from './bird/bird.service';

@Module({
  imports: [UsersModule, DatabaseModule, AuthModule, BirdModule],
  controllers: [AppController, UsersController, AuthController, BirdController],
  providers: [AppService, UsersService, AuthService, BirdService],
})
export class AppModule {}
