import dotenv from 'dotenv';
dotenv.config();
import * as path from 'path';
import { buildSchema } from 'type-graphql';
import SignUpFormResolver from './SignUpForm/resolver';
import BookingResolver from './ShoppingItem/resolver';
import { ApolloServer } from 'apollo-server';
import { createConnection, Connection } from 'typeorm';

export interface Context {
  db: Connection;
}

const startServer = async () => {
  const schema = await buildSchema({
    resolvers: [SignUpFormResolver, BookingResolver],
    emitSchemaFile: path.resolve(__dirname, 'schema.gql'),
  });
  const db = await createConnection();
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
startServer();
