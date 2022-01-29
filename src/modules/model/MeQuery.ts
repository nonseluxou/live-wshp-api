import { extendType, nonNull } from 'nexus';
import { AuthenticationError } from 'apollo-server';

export const MeQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.field('me', {
      type: nonNull('User'),
      async resolve(source, args, ctx, info) {
        if (!ctx.user) {
          throw new AuthenticationError('');
        }

        return ctx.user;
      },
    });
  },
});
