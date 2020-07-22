import uuid_v4 from 'uuid/v4';
import dotenv from 'dotenv';
dotenv.config();
import * as path from 'path';
import { buildSchema } from 'type-graphql';
import { ShoppingItemResolver } from 'src/ShoppingItem/resolver';
import { ApolloServer } from 'apollo-server';
import { UserResolver, ShopResolver } from 'src/User/resolver';
import { PrismaClient } from '@prisma/client';

import CartResolver from './Cart/resolvers';

const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient;
  requestId: string;
}

const startServer = async () => {
  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [ShoppingItemResolver, UserResolver, ShopResolver, CartResolver],
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
