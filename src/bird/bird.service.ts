import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import { DatabaseService } from '../database/database.service';
import ErrorMessages from '../common/errors/errors.enum';
import {
  CloudinaryResponse,
  CloudinaryError,
} from '../common/models/cloudinary.model';
import {
  cloudinaryName,
  cloudinaryKey,
  cloudinarySecret,
} from '../common/constants/env.constants';

cloudinary.config({
  cloud_name: cloudinaryName,
  api_key: cloudinaryKey,
  api_secret: cloudinarySecret,
});

@Injectable()
export class BirdService {
  constructor(private readonly databaseService: DatabaseService) {}

  //---- FETCH ALL BIRDS
  async findAll() {
    return this.databaseService.bird
      .findMany({
        select: { id: true, commName: true },
        take: 10,
      })
      .catch((err) => {
        console.log(err);
        throw new InternalServerErrorException(ErrorMessages.DefaultServer);
      });
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
  async findOneWithImage(id: number) {
    return this.databaseService.bird
      .findUniqueOrThrow({
        where: { id },
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
          return { ...prismaRes, img_href: img };
        }

        return { ...prismaRes, img_href: null };
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
