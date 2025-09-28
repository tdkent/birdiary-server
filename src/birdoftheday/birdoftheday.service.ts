import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { BirdService } from '../bird/bird.service';
import { createBirdOfTheDayIdsArray } from '../common/helpers';
import { Bird, ErrorMessages } from '../common/models';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class BirdOfTheDayService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly birdService: BirdService,
  ) {}
  /** Get most recently added bird from bird id array. */
  async findBirdOfTheDay(): Promise<Bird> {
    return this.databaseService.birdOfTheDay
      .findUniqueOrThrow({
        where: { id: 1 },
        select: { currBirdId: true, bird: true },
      })
      .then(async (res) => {
        const bird = await this.birdService.getBird(res.currBirdId);
        return bird;
      })
      .catch((err) => {
        console.error(err);
        throw new InternalServerErrorException(ErrorMessages.DefaultServer);
      });
  }

  /** Add new id to bird of the day array. */
  @Cron('0 8 * * *') // At 8:00 AM UTC (1:00 AM PST)
  async updateBirdOfTheDay(): Promise<number> {
    try {
      const { birdIds } =
        await this.databaseService.birdOfTheDay.findUniqueOrThrow({
          where: { id: 1 },
          select: { birdIds: true },
        });

      let updatedBirdIds = birdIds;
      if (!updatedBirdIds.length) {
        updatedBirdIds = createBirdOfTheDayIdsArray();
      }
      const randomIdx = Math.ceil(Math.random() * updatedBirdIds.length);
      const randomBirdId = updatedBirdIds[randomIdx];
      updatedBirdIds.splice(randomIdx, 1);

      await this.databaseService.birdOfTheDay.update({
        where: { id: 1 },
        data: { birdIds: updatedBirdIds, currBirdId: randomBirdId },
      });

      return randomBirdId;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(ErrorMessages.DefaultServer);
    }
  }
}
