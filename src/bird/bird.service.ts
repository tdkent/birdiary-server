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

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

@Injectable()
export class BirdService {
  constructor(private readonly databaseService: DatabaseService) {}

  //---- FETCH ALL BIRDS
  async findAll() {
    return this.databaseService.bird
      .findMany({
        include: { images: true, species: true },
        omit: { spec_id: true },
        take: 3,
      })
      .catch(() => {
        throw new InternalServerErrorException(ErrorMessages.DefaultServer);
      });
  }

  //---- FETCH A SINGLE BIRD
  async findOne(id: number) {
    return this.databaseService.bird
      .findUniqueOrThrow({
        where: { id },
        include: { species: true },
        omit: { spec_id: true },
      })
      .then(async (prismaRes) => {
        const imgArr = (await cloudinary.api
          .resources_by_asset_folder(prismaRes.comm_name)
          .then((res) => {
            const cloudinaryRes = res as unknown as CloudinaryResponse;
            console.log('rate limit:', cloudinaryRes.rate_limit_remaining);
            return cloudinaryRes.resources.map((r) => r.secure_url);
          })
          .catch((err) => {
            const {
              error: { message, http_code },
            } = err as CloudinaryError;
            console.log('Cloudinary error: ', http_code, message);
          })) as CloudinaryResponse | void;
        return { ...prismaRes, images: imgArr || [] };
      })
      .catch((err) => {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === 'P2025') {
            throw new NotFoundException(ErrorMessages.ResourceNotFound);
          }
        }
        throw new InternalServerErrorException(ErrorMessages.DefaultServer);
      });
  }
}
