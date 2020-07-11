import uuid_v4 from 'uuid/v4';
import dotenv from 'dotenv';
dotenv.config();
import * as path from 'path';
import { buildSchema, createParamDecorator } from 'type-graphql';
import ShoppingItemResolver from 'src/ShoppingItem/resolver';
import { ApolloServer } from 'apollo-server';
import { createConnection, Connection } from 'typeorm';
import { Container } from 'typedi';
import UserResolver from 'src/User/resolver';

export interface Context {
  db: Connection;
  requestId: string;
}

export function RequestContainer(): ParameterDecorator {
  return function (target: Object, propertyName: string | symbol, index: number) {
    return createParamDecorator<Context>(({ context, info }) => {
      const paramtypes = Reflect.getMetadata('design:paramtypes', target, propertyName);
      const requestContainer = Container.of(context.requestId);
      return requestContainer.get(paramtypes[index]);
    })(target, propertyName, index);
  };
}

const startServer = async () => {
  console.log('building schema');
  const schema = await buildSchema({
    resolvers: [ShoppingItemResolver, UserResolver],
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
