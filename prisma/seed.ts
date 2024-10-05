import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // const hashedPassword = await hash()
  await prisma.user.create({
    data: {
      email: 'tim@tim.me',
      password: 'password',
    },
  });

  await prisma.profile.create({
    data: {
      user_id: 1,
      name: 'Tim',
      location: 'Alameda, CA',
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
