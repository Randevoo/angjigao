import 'reflect-metadata';
import { FindOneShopItemResolver } from '~prisma/resolvers/crud/ShopItem/FindOneShopItemResolver';
import { ShopItemRelationsResolver } from '~prisma/resolvers/relations/ShopItem/ShopItemRelationsResolver';
import { FindManyShopItemResolver } from '~prisma/resolvers/crud/ShopItem/FindManyShopItemResolver';
import { CreateShopResolver } from '~prisma/resolvers/crud/Shop/CreateShopResolver';
import { CreateShopItemResolver } from '~prisma/resolvers/crud/ShopItem/CreateShopItemResolver';
import dotenv from 'dotenv';
dotenv.config({ path: './.env.dev.local' });
import { MultiCartRelationsResolver } from '~prisma/resolvers/relations/MultiCart/MultiCartRelationsResolver';
import { CartRelationsResolver } from '~prisma/resolvers/relations/Cart/CartRelationsResolver';
import { FindOneUserResolver } from '~prisma/resolvers/crud/User/FindOneUserResolver';
import * as path from 'path';
import { buildSchema } from 'type-graphql';
import { ApolloServer } from 'apollo-server';
import { PrismaClient } from '@prisma/client';
import FirebaseAdmin from 'firebase-admin';
import CartResolver from './Cart/resolvers/resolvers';

const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient;
  requestId: string;
}
const admin = FirebaseAdmin;
admin.initializeApp({
  credential: admin.credential.cert('firebase-private-key.json'),
});

const startServer = async () => {
  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        CartResolver,
        FindOneUserResolver,
        CartRelationsResolver,
        MultiCartRelationsResolver,
        CreateShopItemResolver,
        CreateShopResolver,
        FindManyShopItemResolver,
        ShopItemRelationsResolver,
        FindOneShopItemResolver,
      ],
      emitSchemaFile: path.resolve(__dirname, 'schema.gql'),
      validate: false,
    }),
    context: () => ({
      prisma,
      admin,
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
