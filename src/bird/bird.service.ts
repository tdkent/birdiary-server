import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import { DatabaseService } from '../database/database.service';
import ErrorMessages from '../common/errors/errors.enum';
import { GetBirdsByAlphaDto } from 'src/bird/dto/get-birds-by-alpha.dto';
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

cloudinary.config({
  cloud_name: cloudinaryName,
  api_key: cloudinaryKey,
  api_secret: cloudinarySecret,
});

@Injectable()
export class BirdService {
  constructor(private readonly databaseService: DatabaseService) {}

  //---- FETCH ALL BIRDS OR All BY FIRST ALPHA CHARACTER
  //---- PAGINATE RESULTS: 25 RESULTS PER PAGE
  //---- IF USER ID PRESENT, INCLUDE SIGHTING COUNT FOR EACH BIRD
  async findAllByAlpha(id: string, query: GetBirdsByAlphaDto) {
    const { startsWith, page } = query;
    try {
      let countOfRecords = BIRD_COUNT;
      if (startsWith) {
        countOfRecords = await this.databaseService.bird.count({
          where: { commName: { startsWith } },
        });
      }

      const birds = await this.databaseService.bird.findMany({
        // Conditionally use `where` clause to statement
        // https://brockherion.dev/blog/posts/how-to-do-conditional-where-statements-in-prisma/
        where: { ...(startsWith ? { commName: { startsWith } } : {}) },
        omit: { familyId: true },
        include: {
          family: true,
          // Conditionally add '_count' clause if 'id' is defined
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
          // Remove _count field from `bird` object
          const { _count, ...rest } = bird;
          return { ...rest, count: _count.sightings };
        });
        return { message: 'ok', data: { countOfRecords, items: addCount } };
      }

      return { message: 'ok', data: { countOfRecords, birds } };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(ErrorMessages.DefaultServer);
    }
  }

  //---- FETCH A SINGLE BIRD
  async findOne(id: number) {
    return this.databaseService.bird
      .findUniqueOrThrow({
        where: { id },
        select: {
          id: true,
          commName: true,
        },
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

  //---- FETCH A SINGLE BIRD WITH IMAGE
  async findOneWithImage(commName: string) {
    return this.databaseService.bird
      .findUniqueOrThrow({
        where: { commName },
        include: { family: true },
        omit: { familyId: true },
      })
      .then(async (prismaRes) => {
        // if bird has an image, fetch from cloudinary
        if (prismaRes.imgAttr) {
          const img = (await cloudinary.api
            .resources_by_asset_folder(prismaRes.commName)
            .then((res) => {
              const cloudinaryRes = res as unknown as CloudinaryResponse;
              console.log(cloudinaryRes);
              console.log('rate limit:', cloudinaryRes.rate_limit_remaining);
              return cloudinaryRes.resources[0].secure_url;
            })
            .catch((err) => {
              const {
                error: { message, http_code },
              } = err as CloudinaryError;
              console.log('Cloudinary error: ', http_code, message);
            })) as CloudinaryResponse | void;
          return { message: 'ok', data: { ...prismaRes, imgUrl: img } };
        }

        return {
          message: 'ok',
          data: { ...prismaRes, imgAttr: null, imgUrl: null },
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
