import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import { DatabaseService } from '../database/database.service';
import ErrorMessages from '../common/errors/errors.enum';
import GetBirdsDto from 'src/bird/dto/getBirds.dto';
import {
  CloudinaryResponse,
  CloudinaryError,
} from '../common/models/cloudinary.model';
import {
  cloudinaryName,
  cloudinaryKey,
  cloudinarySecret,
} from '../common/constants/env.constants';
import { BIRD_COUNT, TAKE_COUNT } from 'src/common/constants/api.constants';
import { ListResponse } from 'src/types/api';

cloudinary.config({
  cloud_name: cloudinaryName,
  api_key: cloudinaryKey,
  api_secret: cloudinarySecret,
});

@Injectable()
export class BirdService {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Get paginated list of all birds or all by first letter.
   * Include sighting count if token present.
   */
  async getBirds(id: number, query: GetBirdsDto) {
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
        const addCount = birds.map((bird) => {
          const { _count, ...rest } = bird;
          return { ...rest, count: _count.sightings };
        });
        const list: ListResponse = {
          message: 'ok',
          data: { countOfRecords, items: addCount },
        };
        return list;
      }
      const list: ListResponse = {
        message: 'ok',
        data: { countOfRecords, items: birds },
      };
      return list;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(ErrorMessages.DefaultServer);
    }
  }

  //---- FETCH A SINGLE BIRD
  // async findOne(id: number) {
  //   return this.databaseService.bird
  //     .findUniqueOrThrow({
  //       where: { id },
  //       select: {
  //         id: true,
  //         commName: true,
  //       },
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       if (err instanceof Prisma.PrismaClientKnownRequestError) {
  //         if (err.code === 'P2025') {
  //           throw new NotFoundException(ErrorMessages.ResourceNotFound);
  //         }
  //       }
  //       throw new InternalServerErrorException(ErrorMessages.DefaultServer);
  //     });
  // }

  /** Get bird with image URL (if exists) */
  async getBird(id: number) {
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
          return { message: 'ok', data: { ...bird, imgUrl: img } };
        }
        return {
          message: 'ok',
          data: { ...bird },
        };
      })
      .catch((err) => {
        console.log(err);
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === 'P2025') {
            throw new NotFoundException(ErrorMessages.ResourceNotFound);
          }
        }
        throw new InternalServerErrorException(ErrorMessages.DefaultServer);
      });
  }
}
