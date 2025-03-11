import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/common/helpers/auth.helpers';
import { testUserPw } from '../src/common/constants/env.constants';

const prisma = new PrismaClient();

async function main() {
  //? Use to see Family and Bird data
  // await prisma.family.createMany({
  //   data: families,
  // });
  // await prisma.bird.createMany({
  //   data: birds as unknown as Bird,
  // });

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
