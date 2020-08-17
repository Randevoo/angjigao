import 'reflect-metadata';
import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config({ path: './.env.dev.local' });
import { UserRelationsResolver } from '~prisma/resolvers/relations/User/UserRelationsResolver';
import { isNil } from 'lodash';
import { FindOneShopItemResolver } from '~prisma/resolvers/crud/ShopItem/FindOneShopItemResolver';
import { ShopItemRelationsResolver } from '~prisma/resolvers/relations/ShopItem/ShopItemRelationsResolver';
import { FindManyShopItemResolver } from '~prisma/resolvers/crud/ShopItem/FindManyShopItemResolver';
import { CreateShopResolver } from '~prisma/resolvers/crud/Shop/CreateShopResolver';
import { CreateShopItemResolver } from '~prisma/resolvers/crud/ShopItem/CreateShopItemResolver';
import { MultiCartRelationsResolver } from '~prisma/resolvers/relations/MultiCart/MultiCartRelationsResolver';
import { CartRelationsResolver } from '~prisma/resolvers/relations/Cart/CartRelationsResolver';
import { FindOneUserResolver } from '~prisma/resolvers/crud/User/FindOneUserResolver';
import * as path from 'path';
import { buildSchema } from 'type-graphql';
import { ApolloServer } from 'apollo-server';
import { PrismaClient } from '@prisma/client';
import * as admin from 'firebase-admin';
import CartResolver from './Cart/resolvers/resolvers';
import UserResolver from './User/resolvers/resolvers';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_KEY, {
  apiVersion: null,
});

export interface Context {
  prisma: PrismaClient;
  auth: admin.auth.Auth;
  user?: admin.auth.DecodedIdToken;
  stripe: Stripe;
}
const app = admin.initializeApp({
  credential: admin.credential.cert('firebase-private-key.json'),
});

const startServer = async () => {
  const server = new ApolloServer({
    schema: await buildSchema({
      authChecker: ({ context }) => {
        return !isNil(context.user);
      },
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
        UserResolver,
        UserRelationsResolver,
      ],
      emitSchemaFile: path.resolve(__dirname, 'schema.gql'),
      validate: false,
    }),
    context: async ({ req }) => {
      const token = req.headers.authorization || '';
      try {
        const user = await app.auth().verifyIdToken(token);
        return { prisma, auth: app.auth(), user, stripe };
      } catch (e) {
        return { prisma, auth: app.auth(), stripe };
      }
    },
    introspection: true,
    playground: true,
  });
  // The `listen` method launches a web server.
  server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
};

startServer();
