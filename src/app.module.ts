import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { BirdsController } from './birds/birds.controller';

@Module({
  imports: [],
  controllers: [BirdsController],
  providers: [],
})
export class AppModule {}
