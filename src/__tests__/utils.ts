import { ShopResolver } from './../User/resolver';
import { UserResolver } from 'src/User/resolver';
import { ShoppingItemResolver } from 'src/ShoppingItem/resolver';
import { buildSchema } from 'type-graphql';
import DataLoader from 'dataloader';
import { Order } from 'src/models/Order/models';
import uuid_v4 from 'uuid/v4';
import { createConnection, Any } from 'typeorm';
import { ApolloServer } from 'apollo-server';
import OrderResolver from 'src/Order/resolvers';

//TODO: Change out the context, or find a better way to create it. Now mimics prod.
export async function createTestServer({ context = {} } = {}) {
  const db = await createConnection('test');
  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [ShoppingItemResolver, UserResolver, OrderResolver, ShopResolver],
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

  return { server, db };
}
