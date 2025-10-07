import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import { birds } from '../db/birds.json';
import { BirdService } from '../src/bird/bird.service';
import {
  createBirdOfTheDayIdsArray,
  hashPassword,
} from '../src/common/helpers';
import type { Bird, Location } from '../src/common/models';
import { DatabaseService } from '../src/database/database.service';
import { LocationService } from '../src/locations/locations.service';
import { CreateSightingDto } from '../src/sightings/dto/sighting.dto';
import { SightingsService } from '../src/sightings/sightings.service';

const prisma = new PrismaClient();
const databaseService = new DatabaseService();
const birdService = new BirdService(databaseService);
const locationService = new LocationService(databaseService);
const sightingService = new SightingsService(
  databaseService,
  locationService,
  birdService,
);

async function main() {
  await prisma.bird.createMany({
    data: birds as unknown as Bird,
  });

  const user = await prisma.user.create({
    data: {
      email: process.env.TEST_USER_EMAIL,
      password: await hashPassword(process.env.TEST_USER_PW),
      name: 'Tim',
      zipcode: '94501',
      address: 'Alameda, CA 94501, USA',
      favoriteBirdId: 116,
      bio: faker.lorem.sentence(),
    },
  });

  const locations: Omit<Location, 'id'>[] = Array.from({ length: 20 }, () => ({
    name: `${faker.location.city()}, ${faker.location.state()} ${faker.location.zipCode()}`,
    lat: faker.location.latitude(),
    lng: faker.location.longitude(),
    userId: user.id,
  }));

  await prisma.location.createMany({ data: locations });

  const sightings: CreateSightingDto[] = Array.from({ length: 10 }, () => ({
    birdId: Math.floor(Math.random() * birds.length) + 1,
    location: locations[Math.floor(Math.random() * 20)],
    date: faker.date.past({ years: 5 }),
    description: faker.lorem.sentence(),
  }));

  for (const sighting of sightings) {
    await sightingService.createSighting(user.id, sighting);
  }

  const birdIdsArray = createBirdOfTheDayIdsArray();
  const randomIdx = Math.ceil(Math.random() * birdIdsArray.length);
  const randomBirdId = birdIdsArray[randomIdx];
  birdIdsArray.splice(randomIdx, 1);

  await prisma.birdOfTheDay.create({
    data: { birdIds: birdIdsArray, currBirdId: randomBirdId },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
