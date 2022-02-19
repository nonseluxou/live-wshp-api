import { AuthenticationError } from 'apollo-server';
import { extendType, nonNull, nullable, objectType } from 'nexus';

import { NexusGenFieldTypes } from '../../generated/nexus-typegen';

type TimelineResult = NexusGenFieldTypes['Query']['timeline'];

const DEFAULT_ITEM_COUNT = 25;

const PostConnectionEdges = objectType({
  name: 'PostConnectionEdges',
  definition(t) {
    t.nonNull.string('cursor');
    t.nonNull.field('node', { type: 'Post' });
  },
});

const PostConnectionPageInfo = objectType({
  name: 'PostConnectionPageInfo',
  definition(t) {
    t.nonNull.boolean('hasNextPage');
    t.nonNull.boolean('hasPreviousPage');
    t.nonNull.string('startCursor');
    t.nonNull.string('endCursor');
  },
});

const toCursor = (value: string) => Buffer.from(value, 'utf-8').toString('base64');
const fromCursor = (value: string) => Buffer.from(value, 'base64').toString('utf-8');

const PostConnection = objectType({
  name: 'PostConnection',
  definition(t) {
    t.nonNull.list.nonNull.field('edges', { type: PostConnectionEdges });
    t.nonNull.field('pageInfo', { type: PostConnectionPageInfo });
  },
});

export const TimelineQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.field('timeline', {
      type: nonNull(PostConnection),
      args: {
        first: nullable('Int'),
        last: nullable('Int'),
        after: nullable('String'),
        before: nullable('String'),
      },
      async resolve(source, args, ctx, info) {
        if (!ctx.user) {
          throw new AuthenticationError('');
        }

        const user = await ctx.prisma.user.findUnique({
          rejectOnNotFound: true,
          where: { id: ctx.user.id },
          include: { following: { include: { followedUser: false } } },
        });

        const data = await (async (): Promise<TimelineResult['edges'][number]['node'][]> => {
          if (args.last || args.before) {
            return (
              await ctx.prisma.post.findMany({
                where: {
                  AND: [
                    { userId: { in: [user.id, ...user.following.map((it) => it.followedId)] } },
                    { id: { gt: args.before ? fromCursor(args.before) : undefined } },
                  ],
                },
                take: args.last ?? DEFAULT_ITEM_COUNT,
                orderBy: { createdAt: 'asc' },
                include: { by: false, parent: true, replies: false },
              })
            ).reverse();
          }

          return await ctx.prisma.post.findMany({
            where: {
              AND: [
                { userId: { in: [user.id, ...user.following.map((it) => it.followedId)] } },
                { id: { lt: args.after ? fromCursor(args.after) : undefined } },
              ],
            },
            take: args.first ?? DEFAULT_ITEM_COUNT,
            orderBy: { createdAt: 'desc' },
            include: { by: false, parent: true, replies: false },
          });
        })();

        return {
          edges: data.map((it) => ({ cursor: toCursor(it.id), node: it })),
          pageInfo: {
            startCursor: data.length > 0 ? toCursor(data[0].id) : '',
            endCursor: data.length > 0 ? toCursor(data[data.length - 1].id) : '',
            hasNextPage:
              data.length > 0
                ? (await ctx.prisma.post.count({
                    where: { id: { lt: data[data.length - 1].id } },
                  })) > 0
                : false,
            hasPreviousPage:
              data.length > 0
                ? (await ctx.prisma.post.count({
                    where: { id: { gt: data[0].id } },
                  })) > 0
                : false,
          },
        };
      },
    });
  },
});
