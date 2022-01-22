import { PrismaClient } from '@prisma/client';

export const logLevel =
  process.env.NEXT_PUBLIC_LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'debug' : 'trace');

export const graphqlEndpoint = '/api/graphql';

export const prisma = new PrismaClient();
