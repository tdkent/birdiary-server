import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/auth/auth.helpers';
import { TEST_USER_PASSWORD } from '../src/auth/auth.constants';
import { birds } from '../db/birds.json';
import { species } from '../db/species.json';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await hashPassword(TEST_USER_PASSWORD);

  await prisma.user.create({
    data: {
      email: 'tim@tim.me',
      password: hashedPassword,
    },
  });

  await prisma.profile.create({
    data: {
      user_id: 1,
      name: 'Tim',
      location: 'Alameda, CA',
    },
  });

  await prisma.species.createMany({
    data: species,
  });

  await prisma.bird.createMany({
    data: birds,
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
