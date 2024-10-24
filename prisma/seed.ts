import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/common/helpers/auth.helpers';
import { birds } from '../db/birds.json';
import { families } from '../db/families.json';
import { testUserPw } from '../src/common/constants/env.constants';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await hashPassword(testUserPw);
  //! limit birds to 20 records
  const slicedBirds = birds.slice(0, 20);

  await prisma.family.createMany({
    data: families,
  });

  await prisma.bird.createMany({
    data: slicedBirds,
  });

  await prisma.user.create({
    data: {
      email: 'tim@tim.me',
      password: hashedPassword,
      profile: {
        create: {
          name: '',
          location: '',
        },
      },
      fav_bird: {
        create: {
          bird_id: null,
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
