import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Prisma } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import { GetBirdsDto } from '../bird/dto/bird.dto';
import { BIRD_COUNT, TAKE_COUNT } from '../common/constants';
import { createBirdOfTheDayIdsArray } from '../common/helpers';
import {
  Bird,
  CloudinaryError,
  CloudinaryResponse,
  ErrorMessages,
  ListWithCount,
} from '../common/models';
import { DatabaseService } from '../database/database.service';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

@Injectable()
export class BirdService {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Get paginated list of all birds or all by first letter.
   * Include sighting count if token present.
   */
  async getBirds(id: number, query: GetBirdsDto): Promise<ListWithCount<Bird>> {
    const { startsWith, page } = query;
    try {
      let countOfRecords = BIRD_COUNT;
      if (startsWith) {
        countOfRecords = await this.databaseService.bird.count({
          where: { commonName: { startsWith } },
        });
      }
      const birds = await this.databaseService.bird.findMany({
        where: { ...(startsWith ? { commonName: { startsWith } } : {}) },
        include: {
          ...(id
            ? {
                _count: {
                  select: {
                    sightings: { where: { userId: id } },
                  },
                },
              }
            : {}),
        },
        take: TAKE_COUNT,
        skip: TAKE_COUNT * (page - 1),
      });
      if (id) {
        const birdsWithCount = birds.map((bird) => {
          const { _count, ...rest } = bird;
          return { ...rest, count: _count.sightings };
        });
        return { countOfRecords, data: birdsWithCount };
      }
      return { countOfRecords, data: birds };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(ErrorMessages.DefaultServer);
    }
  }

  /** Get bird with image URL (if exists) */
  async getBird(id: number): Promise<Bird> {
    return this.databaseService.bird
      .findUnique({ where: { id } })
      .then(async (bird) => {
        // if bird has an image, fetch from cloudinary
        if (bird.imgAttribute) {
          const img = (await cloudinary.api
            .resources_by_asset_folder(bird.commonName)
            .then((cloudinary) => {
              const imageData = cloudinary as unknown as CloudinaryResponse;
              return imageData.resources[0].secure_url;
            })
            .catch((err) => {
              const {
                error: { message, http_code },
              } = err as CloudinaryError;
              console.error('Cloudinary error: ', http_code, message);
            })) as CloudinaryResponse | void;
          return { ...bird, imgUrl: img };
        }
        return bird;
      })
      .catch((err) => {
        console.error(err);
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === 'P2025') {
            throw new NotFoundException(ErrorMessages.ResourceNotFound);
          }
        }
        throw new InternalServerErrorException(ErrorMessages.DefaultServer);
      });
  }

  /** Get most recently added bird from bird id array. */
  async getBirdOfTheDay(): Promise<Bird> {
    return this.databaseService.birdOfTheDay
      .findUniqueOrThrow({
        where: { id: 1 },
        select: { currBirdId: true, bird: true },
      })
      .then(async (res) => {
        const bird = await this.getBird(res.currBirdId);
        return bird;
      })
      .catch((err) => {
        console.error(err);
        throw new InternalServerErrorException(ErrorMessages.DefaultServer);
      });
  }

  /** Add new id to bird of the day array. */
  @Cron('0 3 * * *') // At 3:00 AM
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
