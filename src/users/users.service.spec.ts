import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { UsersService } from './users.service';
import { ProfileService } from './profile.service';
import { DatabaseService } from '../database/database.service';

describe('UsersService', () => {
  let usersService: UsersService;
  let profileService: ProfileService;

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
    it('throws error if email already exists', async () => {
      const testUser = await usersService.create(payload);
      // Assert
      await expect(usersService.create(payload)).rejects.toThrow(
        BadRequestException,
      );
      // Clean up db
      await usersService.remove(testUser.id);
    });
    it('creates new User and Profile', async () => {
      const testUser = await usersService.create(payload);
      // Assert
      expect(testUser).toHaveProperty('id');
      expect(testUser.email).toBe(payload.email);
      // Clean up db
      await usersService.remove(testUser.id);
    });
  });

  describe('remove user method', () => {
    it('removes user from db', async () => {
      const testUser = await usersService.create(payload);
      await usersService.remove(testUser.id);
      // Assert
      await expect(profileService.findById(testUser.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
