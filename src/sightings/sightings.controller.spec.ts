import { Test, TestingModule } from '@nestjs/testing';
import { SightingsController } from './sightings.controller';
import { SightingsService } from './sightings.service';

describe('SightingsController', () => {
  let controller: SightingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SightingsController],
      providers: [SightingsService],
    }).compile();

    controller = module.get<SightingsController>(SightingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
