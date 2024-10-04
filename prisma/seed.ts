import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      email: 'tim@tim.me',
      name: 'Tim',
      password: 'password',
    },
  });

  await prisma.user.create({
    data: {
      email: 'emily@emily.me',
      name: 'Emily',
      password: 'password',
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
