import 'reflect-metadata';

import dotenv from 'dotenv';
import path from 'path';

import { User } from '~prisma/models';
dotenv.config({ path: path.join(path.dirname(__filename), '../../.env.test') });
import { ApolloServer } from 'apollo-server';
import * as admin from 'firebase-admin';
import { join, map } from 'lodash';
import Stripe from 'stripe';
import { buildSchema } from 'type-graphql';

import { PrismaClient } from '@prisma/client';
import { Context, resolvers } from 'src/commonUtils';

import { insertNewUser } from './seed/user';

//TODO: Change out the context, or find a better way to create it. Now mimics prod.
const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_KEY, {
  apiVersion: null,
});

const app = admin.initializeApp({
  credential: admin.credential.cert(
    path.join(path.dirname(__filename), '../../firebase-private-key-test.json'),
  ),
});

interface TestServerContext extends Partial<Context> {
  server: ApolloServer;
  testUser?: User;
}

export async function createTestServer(): Promise<TestServerContext> {
  let server;
  try {
    server = new ApolloServer({
      schema: await buildSchema({
        resolvers,
        validate: false,
      }),
      context: () => ({
        prisma,
        stripe,
        auth: app.auth(),
      }),
    });
  } catch (e) {
    console.log(e);
  }

  return { server, prisma, stripe, auth: app.auth() };
}

export async function createTestServerWithUser(): Promise<TestServerContext> {
  let server;
  const testUser = await insertNewUser(prisma);
  try {
    server = new ApolloServer({
      schema: await buildSchema({
        resolvers,
        validate: false,
      }),
      context: () => ({
        prisma,
        stripe,
        auth: app.auth(),
        user: { uid: testUser.id },
      }),
    });
  } catch (e) {
    console.log(e);
  }

  return { server, prisma, stripe, auth: app.auth(), testUser };
}

export async function resetDb(): Promise<void> {
  const tableNames = ['Order', 'CartItemCount', 'Shop', 'ShopItem', 'UserTable', 'MultiOrder'];
  const tableNamesWithQuote = map(tableNames, (tableName) => `"${tableName}"`);
  const allTableNameString = join(tableNamesWithQuote, ', ');
  try {
    await prisma.$executeRaw(`TRUNCATE TABLE ${allTableNameString} CASCADE;`);
  } catch (error) {
    throw new Error(`ERROR: Cleaning test db: ${error}`);
  }
}
