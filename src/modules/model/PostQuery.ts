import { extendType, nonNull } from 'nexus';

import { baseLogger } from '../logger';

const logger = baseLogger.child({ scope: 'query/post' });

export const PostQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.field('post', {
      type: 'Post',
      args: { id: nonNull('ID') },
      async resolve(source, args, ctx, info) {
        logger.debug({ source, args }, 'resolver');
        return await ctx.prisma.post.findUnique({
          rejectOnNotFound: true,
          where: { id: args.id },
          include: { by: true },
        });
      },
    });
  },
});
