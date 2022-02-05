import { AuthenticationError } from 'apollo-server';
import { extendType, list, nonNull } from 'nexus';

export const TimelineQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.field('timeline', {
      type: nonNull(list(nonNull('Post'))),
      async resolve(source, args, ctx, info) {
        if (!ctx.user) {
          throw new AuthenticationError('');
        }

        const user = await ctx.prisma.user.findUnique({
          rejectOnNotFound: true,
          where: { id: ctx.user.id },
          include: { following: { include: { followedUser: false } } },
        });

        return await ctx.prisma.post.findMany({
          where: { userId: { in: [user.id, ...user.following.map((it) => it.followedId)] } },
          orderBy: { createdAt: 'desc' },
          include: {
            by: true,
            parent: true,
            replies: { orderBy: { createdAt: 'asc' } },
          },
        });
      },
    });
  },
});
