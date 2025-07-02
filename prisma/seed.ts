import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/common/helpers/auth.helpers';
import {
  testUserEmail,
  testUserPassword,
} from '../src/common/constants/env.constants';
import { birds } from '../db/birds.json';
import type { Bird } from 'src/common/models/db.model';

const prisma = new PrismaClient();

async function main() {
  await prisma.bird.createMany({
    data: birds as unknown as Omit<Bird, 'id'>,
  });

  await prisma.user.create({
    data: {
      email: testUserEmail,
      password: await hashPassword(testUserPassword),
      name: 'Tim',
      favoriteBirdId: 116,
    },
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
