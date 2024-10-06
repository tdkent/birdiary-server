import { Test, TestingModule } from '@nestjs/testing';
import { BirdController } from './bird.controller';
import { BirdService } from './bird.service';

describe('BirdController', () => {
  let controller: BirdController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BirdController],
      providers: [BirdService],
    }).compile();

    controller = module.get<BirdController>(BirdController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
