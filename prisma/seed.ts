import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { hashPassword } from '../src/common/helpers';
import { TEST_USER_EMAIL, TEST_USER_PASSWORD } from '../src/common/constants';
import { birds } from '../db/birds.json';
import type { Bird, Location, Sighting } from '../src/common/models';

const prisma = new PrismaClient();

async function main() {
  await prisma.bird.createMany({
    data: birds as unknown as Bird,
  });

  await prisma.user.create({
    data: {
      email: TEST_USER_EMAIL,
      password: await hashPassword(TEST_USER_PASSWORD),
      name: 'Tim',
      zipcode: 94501,
      address: 'Alameda, CA 94501, USA',
      favoriteBirdId: 116,
    },
  });

  const locations: Omit<Location, 'id'>[] = Array.from({ length: 25 }, () => ({
    name: `${faker.location.city()}, ${faker.location.state()} ${faker.location.zipCode()}`,
    lat: faker.location.latitude(),
    lng: faker.location.longitude(),
  }));

  await prisma.location.createMany({ data: locations });

  const sightings: Omit<Sighting, 'id'>[] = Array.from({ length: 100 }, () => ({
    userId: 1,
    birdId: Math.floor(Math.random() * birds.length) + 1,
    locationId: Math.floor(Math.random() * 25) + 1,
    date: faker.date.past({ years: 5 }),
    description: faker.lorem.sentences({ min: 1, max: 2 }),
  }));

  await prisma.sighting.createMany({ data: sightings });
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
