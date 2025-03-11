import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { DatabaseService } from '../database/database.service';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;

  const payload = {
    email: faker.internet.email(),
    password: faker.internet.password({ length: 8 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UsersService, DatabaseService],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signin method', () => {
    it('throws 404 exception if user does not exist', async () => {
      // Assert
      await expect(authService.signin(payload)).rejects.toThrow(
        NotFoundException,
      );
    });
    it('throws 400 exception if password is incorrent', async () => {
      const testUser = await usersService.create(payload);
      const badPassword = faker.internet.password({ length: 9 });
      // Assert
      await expect(
        authService.signin({ email: payload.email, password: badPassword }),
      ).rejects.toThrow(BadRequestException);
      // Clean up db
      await usersService.remove(testUser.userId);
    });
  });
});
