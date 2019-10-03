import dotenv from "dotenv";
dotenv.config();
import * as path from "path";
import { buildSchema } from "type-graphql";
import Admin from "firebase-admin";
import UserResolver from "./User/resolver";
import SignUpFormResolver from "./SignUpForm/resolver";
import { ApolloServer } from "apollo-server";

let app = Admin.initializeApp({
  credential: Admin.credential.cert({
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    projectId: process.env.FIREBASE_PROJECT_ID
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

export interface Context {
  firebaseDb: Admin.database.Database;
}

const startServer = async () => {
  const schema = await buildSchema({
    resolvers: [UserResolver, SignUpFormResolver],
    emitSchemaFile: path.resolve(__dirname, "schema.gql")
  });

  const server = new ApolloServer({
    schema,
    context: () => ({
      firebaseDb: app.database()
    })
  });

  // The `listen` method launches a web server.
  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
};
startServer();
