import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UpdateProfileDto } from './dtos/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly databaseService: DatabaseService) {}

  //---- FIND USER BY ID
  async findById(id: number) {
    const user = await this.databaseService.user.findUnique({
      where: { id },
      include: {
        profile: true,
        fav_bird: {
          include: { bird: true },
          omit: { user_id: true, bird_id: true },
        },
      },
      omit: { password: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  //---- UPDATE USER PROFILE
  async updateProfile(id: number, updateProfileDto: UpdateProfileDto) {
    const updateUser = await this.databaseService.profile.update({
      where: { user_id: id },
      data: updateProfileDto,
    });

    if (!updateUser) {
      throw new NotFoundException('User not found');
    }

    return updateUser;
  }

  //---- UPSERT FAVORITE BIRD
  upsertFavoriteBird(id: number, birdId: number) {
    //TODO: error handling for out of range bird ids
    return this.databaseService.favorite.upsert({
      where: { user_id: id },
      update: { bird_id: birdId },
      create: {
        user_id: id,
        bird_id: birdId,
      },
    });
  }
}
