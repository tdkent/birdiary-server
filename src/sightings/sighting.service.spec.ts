import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { SightingsService } from './sightings.service';
import { LocationService } from './location.service';
import { UsersService } from '../users/users.service';
import { BirdService } from '../bird/bird.service';
import { DatabaseService } from '../database/database.service';
import { CreateSightingDto } from './dto/create-sighting.dto';
import { NotFoundException } from '@nestjs/common';

describe('SightingService', () => {
  let sightingService: SightingsService;
  let locationService: LocationService;
  let usersService: UsersService;
  let databaseService: DatabaseService;

  let testUserId: string;
  let testSighting: any;
  const fakeUuid = '123e4567-e89b-12d3-a456-426614174000';

  const userPayload = {
    email: faker.internet.email(),
    password: faker.internet.password({ length: 8 }),
  };

  const sightingPayload: CreateSightingDto = {
    bird_id: faker.number.int({ min: 1, max: 20 }),
    date: faker.date.recent(),
    desc: faker.string.alpha({ length: 50 }),
    location: null,
  };

  const locationPayload = {
    name: faker.location.city(),
    lat: faker.location.latitude(),
    lng: faker.location.longitude(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SightingsService,
        LocationService,
        UsersService,
        BirdService,
        DatabaseService,
      ],
    }).compile();

    sightingService = module.get<SightingsService>(SightingsService);
    locationService = module.get<LocationService>(LocationService);
    usersService = module.get<UsersService>(UsersService);
    databaseService = module.get<DatabaseService>(DatabaseService);

    const testUser = await usersService.create(userPayload);
    testUserId = testUser.user_id;

    const sighting = await sightingService.create(testUserId, sightingPayload);
    testSighting = sighting;
  });

  afterEach(async () => {
    // removes User and related Sightings
    await usersService.remove(testUserId);
  });

  it('should be defined', () => {
    expect(sightingService).toBeDefined();
  });

  describe('create sighting method', () => {
    it('creates new sighting', async () => {
      // Assert
      expect(testSighting.id).toBeDefined();
      expect(testSighting.bird_id).toBe(sightingPayload.bird_id);
    });
    it('has null location if a location is not provided in request', async () => {
      // Assert
      expect(testSighting.location).toBeNull();
    });
    it('correctly upserts a new location', async () => {
      const testSightingWithLocation = await sightingService.create(
        testUserId,
        {
          ...sightingPayload,
          location: locationPayload,
        },
      );
      const testLocation = await locationService.findOne(
        testSightingWithLocation.location.id,
      );
      // Assert
      expect(testSightingWithLocation.location).not.toBeNull();
      expect(testLocation.name).toBe(locationPayload.name);
      // Clean up db
      await databaseService.location.delete({ where: { id: testLocation.id } });
    });
    it('correctly upserts an existing location', async () => {
      // Add location
      const testLocation = await locationService.upsert(locationPayload);
      // Add sighting with identical location
      const testSightingWithLocation = await sightingService.create(
        testUserId,
        {
          ...sightingPayload,
          location: locationPayload,
        },
      );
      // Assert
      expect(testLocation.id).toBe(testSightingWithLocation.location.id);
      // Clean up db
      await databaseService.location.delete({ where: { id: testLocation.id } });
    });
  });

  describe('update sighting method', () => {
    it('correctly updates individual props', async () => {
      const updatedSightingPayload = {
        ...testSighting,
        desc: faker.string.alpha({ length: 25 }),
      };
      const updateTestSighting = await sightingService.update(
        testUserId,
        testSighting.id,
        updatedSightingPayload,
      );
      const updatedSighting = await sightingService.findOne(
        testUserId,
        testSighting.id,
      );
      // Assert
      expect(updateTestSighting.count).toBe(1);
      expect(updatedSighting.desc).toBe(updatedSightingPayload.desc);
      expect(updatedSighting.bird_id).toBe(testSighting.bird_id);
    });
  });

  describe('remove sighting method', () => {
    it('throws 404 error if sighting does not exist, or user is not authorized', async () => {
      // Assert
      await expect(
        sightingService.remove(fakeUuid, testSighting.id),
      ).rejects.toThrow(NotFoundException);
    });
    it('correctly removes sighting', async () => {
      const res = await sightingService.remove(testUserId, testSighting.id);
      // Assert
      expect(res.count).toBe(1);
    });
  });
});
