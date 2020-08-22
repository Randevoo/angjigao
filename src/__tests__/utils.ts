import 'reflect-metadata';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.join(path.dirname(__filename), '../../.env.test') });
import { resolvers } from 'src/commonUtils';
import { PrismaClient } from '@prisma/client';
import { buildSchema } from 'type-graphql';
import { ApolloServer } from 'apollo-server';
import { join, map } from 'lodash';
import Stripe from 'stripe';
import * as admin from 'firebase-admin';

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

export async function createTestServer({ context = {} } = {}) {
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

export async function resetDb() {
  const tableNames = ['Order', 'CartItemCount', 'Shop', 'ShopItem', 'UserTable', 'MultiOrder'];
  const tableNamesWithQuote = map(tableNames, (tableName) => `"${tableName}"`);
  const allTableNameString = join(tableNamesWithQuote, ', ');
  try {
    await prisma.executeRaw(`TRUNCATE TABLE ${allTableNameString} CASCADE;`);
  } catch (error) {
    throw new Error(`ERROR: Cleaning test db: ${error}`);
  }
}
