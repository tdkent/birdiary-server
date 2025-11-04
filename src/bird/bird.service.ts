import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import { GetBirdsDto, GetSightingsByBirdIdDto } from '../bird/dto/bird.dto';
import {
  BIRD_COUNT,
  DETAILS_RESULTS_PER_PAGE,
  RESULTS_PER_PAGE,
} from '../common/constants';
import { Bird, ErrorMessages, ListWithCount } from '../common/models';
import { DatabaseService } from '../database/database.service';
import { getBirdsBySearchTerm, getSearchCount } from './sql/bird.sql';

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
    const { search, startsWith, page } = query;
    try {
      let countOfRecords = BIRD_COUNT;
      if (search) {
        const count: { count: number }[] = await this.databaseService.$queryRaw(
          getSearchCount(search),
        );
        const searchResults: Bird[] = await this.databaseService.$queryRaw(
          getBirdsBySearchTerm(search, page, id),
        );
        return { countOfRecords: count[0].count, data: searchResults };
      }
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
        take: RESULTS_PER_PAGE,
        skip: RESULTS_PER_PAGE * (page - 1),
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

  async getSightingsByBirdId(
    userId: number,
    reqQuery: GetSightingsByBirdIdDto,
    birdId: number,
  ) {
    const { page, sortBy } = reqQuery;
    try {
      const count = await this.databaseService.sighting.count({
        where: { userId, birdId },
      });
      const data = await this.databaseService.bird.findUniqueOrThrow({
        where: { id: birdId },
        include: {
          sightings: {
            where: { userId },
            include: { location: true },
            orderBy: sortBy === 'dateAsc' ? { date: 'asc' } : { date: 'desc' },
            take: DETAILS_RESULTS_PER_PAGE,
            skip: DETAILS_RESULTS_PER_PAGE * (page - 1),
          },
        },
      });
      return { countOfRecords: count, data: data.sightings };
    } catch (error) {
      console.error(error);
      if (error instanceof BadRequestException) {
        throw new BadRequestException(ErrorMessages.BadRequest);
      }
      throw new InternalServerErrorException(ErrorMessages.DefaultServer);
    }
  }
}
