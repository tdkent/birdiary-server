import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/common/helpers/auth.helpers';
import { testUserPw } from '../src/common/constants/env.constants';
import { birds } from '../db/birds.json';
import type { Bird } from 'src/common/models/bird.model';

const prisma = new PrismaClient();

async function main() {
  await prisma.bird.createMany({
    data: birds as unknown as Bird,
  });

  await prisma.user.create({
    data: {
      email: 'tim@tim.me',
      password: await hashPassword(testUserPw),
      profile: {
        create: {
          name: '',
          location: '',
        },
      },
      favBird: {
        create: {
          birdId: null,
        },
      },
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
