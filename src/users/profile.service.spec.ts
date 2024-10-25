import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { ProfileService } from './profile.service';
import { UsersService } from './users.service';
import { DatabaseService } from '../database/database.service';
import { UpdateProfileDto } from './dtos/update-profile.dto';

describe('ProfileService', () => {
  let profileService: ProfileService;
  let usersService: UsersService;
  let testUserId: number | null = null;

  const createUserPayload = {
    email: faker.internet.email(),
    password: faker.internet.password({ length: 8 }),
  };

  const updateUserPayload: UpdateProfileDto = {
    name: faker.person.fullName(),
    location: faker.location.city(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfileService, UsersService, DatabaseService],
    }).compile();

    profileService = module.get<ProfileService>(ProfileService);
    usersService = module.get<UsersService>(UsersService);

    const testUser = await usersService.create(createUserPayload);
    testUserId = testUser.id;
  });

  afterEach(async () => {
    await usersService.remove(testUserId);
  });

  it('should be defined', () => {
    expect(profileService).toBeDefined();
  });

  describe('update profile method', () => {
    it('throws 404 error if user does not exist', async () => {
      await expect(
        profileService.updateProfile(-1, updateUserPayload),
      ).rejects.toThrow(NotFoundException);
    });
    it('correctly updates user profile', async () => {
      await profileService.updateProfile(testUserId, updateUserPayload);
      const fetchTestUser = await profileService.findById(testUserId);
      // Assert
      expect(fetchTestUser.profile.name).toBe(updateUserPayload.name);
      expect(fetchTestUser.profile.location).toBe(updateUserPayload.location);
    });
  });

  describe('update favorite bird method', () => {
    it("correctly updates user's favorite bird", async () => {
      const birdId = 10;
      await profileService.updateFavoriteBird(testUserId, birdId);
      const fetchTestUser = await profileService.findById(testUserId);
      // Assert
      expect(fetchTestUser.fav_bird.bird).toBeDefined();
      expect(fetchTestUser.fav_bird.bird.id).toBe(birdId);
    });
  });
});
