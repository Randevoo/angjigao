import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env.test' });
import { CartRelationsResolver } from '~prisma/resolvers/relations/Cart/CartRelationsResolver';
import { FindOneUserResolver } from '~prisma/resolvers/crud/User/FindOneUserResolver';
import { PrismaClient } from '@prisma/client';
import { buildSchema } from 'type-graphql';
import uuid_v4 from 'uuid/v4';
import { createConnection, Any, Connection } from 'typeorm';
import { ApolloServer } from 'apollo-server';
import { join, map } from 'lodash';
import CartResolver from 'src/Cart/resolvers/resolvers';

//TODO: Change out the context, or find a better way to create it. Now mimics prod.
const prisma = new PrismaClient();
export async function createTestServer({ context = {} } = {}) {
  let server;
  try {
    server = new ApolloServer({
      schema: await buildSchema({
        resolvers: [CartResolver, FindOneUserResolver, CartRelationsResolver],
        validate: false,
      }),
      context: () => ({
        requestId: uuid_v4(),
        prisma,
      }),
    });
  } catch (e) {
    console.log(e);
  }

  return { server, prisma };
}

export async function resetDb() {
  const tableNames = ['Cart', 'CartItemCount', 'Shop', 'ShopItem', 'UserTable'];
  const tableNamesWithQuote = map(tableNames, (tableName) => `"${tableName}"`);
  const allTableNameString = join(tableNamesWithQuote, ', ');
  try {
    await prisma.executeRaw(`TRUNCATE TABLE ${allTableNameString} CASCADE;`);
  } catch (error) {
    throw new Error(`ERROR: Cleaning test db: ${error}`);
  }
}
