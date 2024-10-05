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
});
