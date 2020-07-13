import DataLoader from 'dataloader';
import uuid_v4 from 'uuid/v4';
import dotenv from 'dotenv';
dotenv.config();
import * as path from 'path';
import { buildSchema } from 'type-graphql';
import ShoppingItemResolver from 'src/ShoppingItem/resolver';
import { ApolloServer } from 'apollo-server';
import { Connection, createConnection, Any } from 'typeorm';
import { UserResolver, ShopResolver } from 'src/User/resolver';
import { Order } from './models/Order/models';
import OrderResolver from './Order/resolvers';

export interface Context {
  db: Connection;
  requestId: string;
  orderLoader: DataLoader<string, Order | undefined>;
}

const startServer = async () => {
  console.log('building schema');
  const schema = await buildSchema({
    resolvers: [ShoppingItemResolver, UserResolver, OrderResolver, ShopResolver],
    emitSchemaFile: path.resolve(__dirname, 'schema.gql'),
  });
  console.log('creating connection');
  const db = await createConnection();
  console.log('connection created');
  const server = new ApolloServer({
    schema,
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
    introspection: true,
    playground: true,
  });

  // The `listen` method launches a web server.
  server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
};
console.log('Hello');
startServer();
