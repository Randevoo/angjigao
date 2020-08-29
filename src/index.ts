import 'reflect-metadata';

import { ApolloServer } from 'apollo-server';
import dotenv from 'dotenv';
import * as admin from 'firebase-admin';
import { isNil } from 'lodash';
import * as path from 'path';
import Stripe from 'stripe';
import { buildSchema } from 'type-graphql';

import { PrismaClient } from '@prisma/client';

import { resolvers } from './commonUtils';

dotenv.config({ path: './.env.dev.local' });

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_KEY, {
  apiVersion: null,
});

const app = admin.initializeApp({
  credential: admin.credential.cert('firebase-private-key.json'),
});

const startServer = async () => {
  const server = new ApolloServer({
    schema: await buildSchema({
      authChecker: ({ context }) => {
        return !isNil(context.user);
      },
      resolvers,
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
