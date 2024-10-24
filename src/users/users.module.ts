import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ProfileService } from './profile.service';
import { AuthService } from './auth.service';
import { DatabaseModule } from '../database/database.module';
import { jwtKey } from '../common/constants/env.constants';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      global: true,
      secret: jwtKey,
      signOptions: { expiresIn: 3600 },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, ProfileService, AuthService],
})
export class UsersModule {}
