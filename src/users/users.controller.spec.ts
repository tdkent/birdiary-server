import { Test } from '@nestjs/testing';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TEST_USER_PASSWORD } from '../auth/auth.constants';

const moduleMocker = new ModuleMocker(global);

describe('UsersController', () => {
  let controller: UsersController;

  const testUser = {
    id: 999,
    email: 'test@test.test',
    profile: {
      name: '',
      location: '',
    },
  };

  const testUserProfile = {
    name: 'Test User',
    location: 'Cucamonga, CA',
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
    })
      .useMocker((token) => {
        if (token === UsersService) {
          return {
            create: jest.fn().mockResolvedValue(testUser),
            findAll: jest.fn().mockResolvedValue([testUser]),
            findById: jest.fn().mockResolvedValue(testUser),
            update: jest.fn().mockResolvedValue(testUserProfile),
          };
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    controller = moduleRef.get(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create controller', () => {
    it('creates and returns a new user', async () => {
      const newUser = await controller.create({
        email: testUser.email,
        password: TEST_USER_PASSWORD,
      });
      expect(newUser).not.toBeNull();
      expect(newUser.email).toBe(testUser.email);
      expect(newUser.profile).toBeDefined();
      expect(newUser.profile?.name).toBe('');
      expect(newUser.profile?.location).toBe('');
    });
  });

  describe('findAll controller', () => {
    it('returns an array of users', async () => {
      const users = await controller.findAll();
      expect(users.length).toBe(1);
      expect(users[0].id).toBe(testUser.id);
      expect(users[0].email).toBe(testUser.email);
    });
  });

  describe('findOne controller', () => {
    it('returns the correct user', async () => {
      const user = await controller.findOne(testUser.id);
      expect(user).not.toBeNull();
      expect(user.id).toBe(testUser.id);
      expect(user.id).not.toBe(testUser.id + 1);
      expect(user.email).toBe(testUser.email);
    });
  });

  describe('update controller', () => {
    it('correctly updates user profile', async () => {
      const updatedUserProfile = await controller.update(
        testUser.id,
        testUserProfile,
      );
      expect(updatedUserProfile).not.toBeNull();
      expect(updatedUserProfile.name).toBe(testUserProfile.name);
      expect(updatedUserProfile.location).toBe(testUserProfile.location);
    });
  });
});
