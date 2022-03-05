import { PrismaClient } from '@prisma/client';
import { DateTime } from 'luxon';

import messages from './messages.json';

const prisma = new PrismaClient();

const run = async () => {
  const startTime = DateTime.fromISO('2022-01-01T00:00:00.000Z');

  const ironMan = await prisma.user.create({
    data: {
      nickname: 'ironMan',
    },
  });

  const cap = await prisma.user.create({
    data: {
      nickname: 'cap',
    },
  });

  const thanos = await prisma.user.create({
    data: {
      nickname: 'thanos',
    },
  });

  await prisma.follow.create({
    data: {
      userId: ironMan.id,
      followedId: cap.id,
    },
  });

  await prisma.follow.create({
    data: {
      userId: thanos.id,
      followedId: ironMan.id,
    },
  });

  await prisma.follow.create({
    data: {
      userId: thanos.id,
      followedId: cap.id,
    },
  });

  await prisma.post.createMany({
    data: [
      messages.ironMan.map((it) => ({ message: it, userId: ironMan.id })),
      messages.cap.map((it) => ({ message: it, userId: cap.id })),
      messages.thanos.map((it) => ({ message: it, userId: thanos.id })),
    ]
      .flat()
      .sort((a, b) => a.message.localeCompare(b.message))
      .map(({ message, userId }, index) => {
        const createdAt = startTime.plus({ minutes: index }).toISO();
        return {
          id: createdAt,
          userId,
          message,
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
