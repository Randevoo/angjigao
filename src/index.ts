import dotenv from 'dotenv';
dotenv.config();
import * as path from 'path';
import { buildSchema } from 'type-graphql';
import ShoppingItemResolver from 'src/ShoppingItem/resolver';
import { ApolloServer } from 'apollo-server';
import { createConnection, Connection } from 'typeorm';

export interface Context {
  db: Connection;
}

const startServer = async () => {
  console.log('building schema');
  const schema = await buildSchema({
    resolvers: [ShoppingItemResolver],
    emitSchemaFile: path.resolve(__dirname, 'schema.gql'),
  });
  console.log('creating connection');
  const db = await createConnection();
  console.log('connection created');
  const server = new ApolloServer({
    schema,
    context: () => ({
      db,
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
