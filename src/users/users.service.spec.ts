import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { UsersService } from './users.service';
import { ProfileService } from './profile.service';
import { DatabaseService } from '../database/database.service';

describe('UsersService', () => {
  let usersService: UsersService;
  let profileService: ProfileService;
  let testUserId: number | null = null;

  const payload = {
    email: faker.internet.email(),
    password: faker.internet.password({ length: 8 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, ProfileService, DatabaseService],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    profileService = module.get<ProfileService>(ProfileService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('create user method', () => {
    beforeEach(async () => {
      const testUser = await usersService.create(payload);
      testUserId = testUser.id;
    });

    afterEach(async () => {
      await usersService.remove(testUserId);
    });
    it('throws error if email already exists', async () => {
      // Assert
      await expect(usersService.create(payload)).rejects.toThrow(
        BadRequestException,
      );
    });
    it('creates new user', async () => {
      const testUserProfile = await profileService.findById(testUserId);
      // Assert
      expect(testUserProfile.email).toBe(payload.email);
    });
    it('creates related Profile record with null values', async () => {
      const testUserProfile = await profileService.findById(testUserId);
      // Assert
      expect(testUserProfile.profile).toBeDefined();
      expect(testUserProfile.profile.user_id).toBe(testUserId);
      expect(testUserProfile.profile.name).toBeNull();
    });
    it('creates related Favorite record with null values', async () => {
      const testUserProfile = await profileService.findById(testUserId);
      // Assert
      expect(testUserProfile.fav_bird).toBeDefined();
      expect(testUserProfile.fav_bird.bird).toBeNull();
    });
  });

  describe('remove user method', () => {
    it('removes user from db', async () => {
      const testUser = await usersService.create(payload);
      await usersService.remove(testUser.id);
      // Assert
      await expect(profileService.findById(testUserId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
