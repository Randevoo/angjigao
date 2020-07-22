import { PrismaClient } from '@prisma/client';
import { ShopResolver } from './../User/resolver';
import { UserResolver } from 'src/User/resolver';
import { ShoppingItemResolver } from 'src/ShoppingItem/resolver';
import { buildSchema } from 'type-graphql';
import uuid_v4 from 'uuid/v4';
import { createConnection, Any, Connection } from 'typeorm';
import { ApolloServer } from 'apollo-server';
import { join, map } from 'lodash';
import CartResolver from 'src/Cart/resolvers';

//TODO: Change out the context, or find a better way to create it. Now mimics prod.
const prisma = new PrismaClient();
export async function createTestServer({ context = {} } = {}) {
  let server;
  try {
    server = new ApolloServer({
      schema: await buildSchema({
        resolvers: [ShoppingItemResolver, UserResolver, ShopResolver, CartResolver],
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
  const tableNames = ['Cart', 'CartItemCount', 'Shop', 'ShopItem', 'User'];

  const allTableNameString = join(tableNames, ', ');
  try {
    await prisma.queryRaw(`TRUNCATE TABLE ${allTableNameString} CASCADE;`);
  } catch (error) {
    throw new Error(`ERROR: Cleaning test db: ${error}`);
  }
}
