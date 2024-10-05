import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { DatabaseService } from '../database/database.service';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [JwtService, UsersService, DatabaseService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll method', () => {
    it('returns an array of users', async () => {
      const users = await controller.findAll();
      expect(users.length).toBeGreaterThanOrEqual(1);
      expect(users[0].id).toBeGreaterThanOrEqual(1);
    });
  });

  describe('create method', () => {
    it('returns a new user', async () => {});
  });
});
