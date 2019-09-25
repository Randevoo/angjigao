import Express from "express";
import graphqlHTTP from "express-graphql";
import * as path from "path";
import { buildSchema } from "type-graphql";
import UserResolver from "./User/resolver";

const startServer = async () => {
  const schema = await buildSchema({
    resolvers: [UserResolver],
    emitSchemaFile: path.resolve(__dirname, "schema.gql")
  });

  const app = Express();
  app.use(
    "/graphql",
    graphqlHTTP({
      schema,
      graphiql: true
    })
  );
  app.listen(8081);
  console.log("Running a GraphQL API server at localhost:8081/graphql");
};
