import type { PrismaClient, User } from '@prisma/client';

export type MyContextType = {
  prisma: PrismaClient;
  user: null | User;
};
