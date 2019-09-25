import Express from "express";
import graphqlHTTP from "express-graphql";
import * as path from "path";
import { buildSchema } from "type-graphql";
import UserResolver from "./User/resolver";
import { ApolloServer } from "apollo-server";

const startServer = async () => {
  const schema = await buildSchema({
    resolvers: [UserResolver],
    emitSchemaFile: path.resolve(__dirname, "schema.gql")
  });

  const server = new ApolloServer({
    schema
  });

  // The `listen` method launches a web server.
  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
};
startServer();
