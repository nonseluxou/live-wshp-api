import { AuthenticationError, UserInputError } from 'apollo-server';
import { DateTime } from 'luxon';
import { extendType, nonNull, nullable } from 'nexus';

export const PublishPostMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('publish', {
      type: nonNull('Post'),
      args: { message: nonNull('String'), parentId: nullable('ID') },
      async resolve(source, args, ctx, info) {
        if (!ctx.user) {
          throw new AuthenticationError('');
        }

        const message = args.message.trim();
        if (!message) {
          throw new UserInputError('"message" cannot be empty');
        }

        return await ctx.prisma.post.create({
          data: {
            id: DateTime.utc().toISO(),
            userId: ctx.user.id,
            message,
            parentId: args.parentId ?? undefined,
          },
        });
      },
    });
  },
});
