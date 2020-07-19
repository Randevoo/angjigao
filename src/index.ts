import DataLoader from 'dataloader';
import uuid_v4 from 'uuid/v4';
import dotenv from 'dotenv';
dotenv.config();
import * as path from 'path';
import { buildSchema } from 'type-graphql';
import { ShoppingItemResolver } from 'src/ShoppingItem/resolver';
import { ApolloServer } from 'apollo-server';
import { Connection, createConnection, Any } from 'typeorm';
import { UserResolver, ShopResolver } from 'src/User/resolver';
import { GraphQLDatabaseLoader } from '@mando75/typeorm-graphql-loader';
import CartResolver from './Cart/resolvers';

export interface Context {
  db: Connection;
  requestId: string;
  loader: GraphQLDatabaseLoader;
}

const startServer = async () => {
  const db = await createConnection();
  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [ShoppingItemResolver, UserResolver, ShopResolver, CartResolver],
      emitSchemaFile: path.resolve(__dirname, 'schema.gql'),
      validate: false,
    }),
    context: () => ({
      db,
      requestId: uuid_v4(),
      loader: new GraphQLDatabaseLoader(db),
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
