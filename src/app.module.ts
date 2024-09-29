import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BirdsController } from './birds/birds.controller';

@Module({
  imports: [],
  controllers: [AppController, BirdsController],
  providers: [AppService],
})
export class AppModule {}
