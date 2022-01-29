import { extendType, nonNull } from 'nexus';

export const SignInMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('signIn', {
      type: nonNull('User'),
      args: { nickname: nonNull('String') },
      async resolve(source, args, ctx, info) {
        try {
          return await ctx.prisma.user.findUnique({
            rejectOnNotFound: true,
            where: { nickname: args.nickname },
          });
        } catch (err) {
          return await ctx.prisma.user.create({
            data: { nickname: args.nickname },
          });
        }
      },
    });
  },
});
