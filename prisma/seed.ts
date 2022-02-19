import { PrismaClient } from '@prisma/client';
import { DateTime } from 'luxon';

const prisma = new PrismaClient();

const run = async () => {
  const posts = Array(2000).fill(null);

  const startTime = DateTime.fromISO('2022-01-01T00:00:00.000Z');

  const user1 = await prisma.user.create({
    data: {
      nickname: 'mia',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      nickname: 'rue',
    },
  });

  await prisma.post.createMany({
    data: posts.map((_, index) => {
      const createdAt = startTime.plus({ minutes: index }).toISO();
      return {
        id: createdAt,
        userId: index % 2 !== 0 ? user1.id : user2.id,
        message: Intl.NumberFormat('en').format(index + 1),
        createdAt,
      };
    }),
  });
};

run()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
