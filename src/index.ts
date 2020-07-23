import 'reflect-metadata';
import { MultiCartRelationsResolver } from '~prisma/resolvers/relations/MultiCart/MultiCartRelationsResolver';
import { CartRelationsResolver } from '~prisma/resolvers/relations/Cart/CartRelationsResolver';
import { FindOneUserResolver } from '~prisma/resolvers/crud/User/FindOneUserResolver';
import uuid_v4 from 'uuid/v4';
import dotenv from 'dotenv';
dotenv.config();
import * as path from 'path';
import { buildSchema } from 'type-graphql';
import { ApolloServer } from 'apollo-server';
import { PrismaClient } from '@prisma/client';

import CartResolver from './Cart/resolvers/resolvers';

const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient;
  requestId: string;
}

const startServer = async () => {
  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        CartResolver,
        FindOneUserResolver,
        CartRelationsResolver,
        MultiCartRelationsResolver,
      ],
      emitSchemaFile: path.resolve(__dirname, 'schema.gql'),
      validate: false,
    }),
    context: () => ({
      requestId: uuid_v4(),
      prisma,
    }),
    introspection: true,
    playground: true,
  });

  // The `listen` method launches a web server.
  server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
};

startServer();
