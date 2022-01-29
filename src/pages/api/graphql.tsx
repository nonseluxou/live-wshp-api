import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-micro';
import { NextApiRequest, NextApiResponse } from 'next';

import { corsMiddleware } from '../../modules/cors';
import { graphqlEndpoint, prisma } from '../../modules/env';
import { schema } from '../../modules/model';

const server = new ApolloServer({
  schema,
  introspection: true,
  context: async ({ req }) => {
    const id: string | null =
      (req.headers.authorization || '').replace(/bearer/i, '').trim() || null;

    return { prisma, user: !id ? null : await prisma.user.findUnique({ where: { id } }) };
  },
  plugins: [ApolloServerPluginLandingPageLocalDefault({ footer: false })],
});

await server.start();
const handler = server.createHandler({ path: graphqlEndpoint });

export default async function (req: NextApiRequest, res: NextApiResponse) {
  await corsMiddleware({ req, res });
  return handler(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
