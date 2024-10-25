import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { UsersService } from './users.service';
import { DatabaseService } from '../database/database.service';
import { BadRequestException } from '@nestjs/common';

describe('UsersService', () => {
  let usersService: UsersService;

  const payload = {
    email: faker.internet.email(),
    password: faker.internet.password({ length: 8 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, DatabaseService],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('create', () => {
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
});
