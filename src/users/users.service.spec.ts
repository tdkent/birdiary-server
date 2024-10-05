import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { DatabaseService } from '../database/database.service';

describe('UsersService', () => {
  let service: UsersService;
  const testId = 1;
  const testEmail = 'tim@tim.me';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, DatabaseService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll method', () => {
    it('returns an array of users', async () => {
      const users = await service.findAll();
      expect(users.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('findById method', () => {
    it('returns the requested user', async () => {
      const user = await service.findById(testId);
      expect(user).not.toBeNull();
      expect(user.email).toBe(testEmail);
    });

    it('throws 404 if user not found', async () => {
      await expect(service.findById(-1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEmail method', () => {
    it('returns the requested user', async () => {
      const user = await service.findByEmail(testEmail);
      expect(user).not.toBeNull();
      expect(user.id).toBe(testId);
    });
  });
});
