import { ShopResolver } from './../User/resolver';
import { UserResolver } from 'src/User/resolver';
import { ShoppingItemResolver } from 'src/ShoppingItem/resolver';
import { buildSchema } from 'type-graphql';
import DataLoader from 'dataloader';
import { Order } from 'src/models/Order/models';
import uuid_v4 from 'uuid/v4';
import { createConnection, Any, Connection } from 'typeorm';
import { ApolloServer } from 'apollo-server';
import OrderResolver from 'src/Order/resolvers';
import { join, map } from 'lodash';
import CartResolver from 'src/Cart/resolvers';

//TODO: Change out the context, or find a better way to create it. Now mimics prod.
export async function createTestServer({ context = {} } = {}) {
  const db = await createConnection('test');
  let server;
  try {
    server = new ApolloServer({
      schema: await buildSchema({
        resolvers: [ShoppingItemResolver, UserResolver, OrderResolver, ShopResolver, CartResolver],
        validate: false,
      }),
      context: () => ({
        db,
        requestId: uuid_v4(),
        orderLoader: new DataLoader(async (ids: readonly string[]) => {
          const orders = await db
            .getRepository(Order)
            .find({ where: { buyer_id: Any(ids as string[]) } });
          return ids.map((id) => orders.find((order) => order.id === id));
        }),
      }),
    });
  } catch (e) {
    console.log(e);
  }

  return { server, db };
}

export async function resetDb(db: Connection) {
  const entities = map(await db.entityMetadatas, (metadata) => metadata.tableName);

  const allTableNameString = join(entities, ', ');
  try {
    await db.manager.query(`TRUNCATE TABLE ${allTableNameString} CASCADE;`);
  } catch (error) {
    throw new Error(`ERROR: Cleaning test db: ${error}`);
  }
}
