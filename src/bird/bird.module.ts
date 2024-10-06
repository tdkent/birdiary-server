import { Module } from '@nestjs/common';
import { BirdService } from './bird.service';
import { BirdController } from './bird.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [BirdController],
  providers: [BirdService],
})
export class BirdModule {}
