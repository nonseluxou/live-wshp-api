import { objectType } from 'nexus';

import { baseLogger } from '../logger';

const logger = baseLogger.child({ scope: 'object/post' });

export const Post = objectType({
  name: 'Post',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.string('message');
    t.nonNull.dateTime('createdAt');
    t.nonNull.field('by', {
      type: 'User',
      async resolve(source, args, ctx, info) {
        logger.debug({ source, args }, '"by" resolver');
        const data = await ctx.prisma.post.findUnique({
          rejectOnNotFound: true,
          where: { id: source.id },
          include: { by: true },
        });

        return data.by;
      },
    });
    t.nullable.field('parent', {
      type: 'Post',
      async resolve(source, args, ctx, info) {
        logger.debug({ source, args }, '"parent" resolver');
        const data = await ctx.prisma.post.findUnique({
          rejectOnNotFound: true,
          where: { id: source.id },
          include: { parent: true },
        });

        return data.parent;
      },
    });
    t.nonNull.list.nonNull.field('replies', {
      type: 'Post',
      async resolve(source, args, ctx, info) {
        logger.debug({ source, args }, '"replies" resolver');
        const data = await ctx.prisma.post.findUnique({
          rejectOnNotFound: true,
          where: { id: source.id },
          include: { replies: true },
        });

        return data.replies;
      },
    });
  },
});
