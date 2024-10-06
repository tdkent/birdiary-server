import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/auth/auth.helpers';
import { TEST_USER_PASSWORD } from '../src/auth/auth.constants';

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

  await prisma.bird.create({
    data: {
      comm_name: 'Brown Pelican',
      sci_name: 'Pelecanus occidentalis',
      type: 'Cormorants, Pelicans',
      status: 'LC',
    },
  });

  await prisma.image.create({
    data: {
      img_url:
        'https://en.wikipedia.org/wiki/Brown_pelican#/media/File:Brown_Pelican21K.jpg',
      bird_name: 'Brown Pelican',
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
