import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { BirdController } from './bird.controller';
import { BirdService } from './bird.service';

@Module({
  imports: [DatabaseModule],
  controllers: [BirdController],
  providers: [BirdService],
})
export class BirdModule {}
