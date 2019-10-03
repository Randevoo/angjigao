import SignUpFormResolver from "../../src/SignUpForm/resolver";
import { buildSchema } from "type-graphql";
import { GraphQLSchema } from "graphql";
import { firebaseDb } from "../../src";

describe("SignUpForm resolver", () => {
  let schema: GraphQLSchema;
  let mockFirebase = jest.mock("firebaseDb");

  beforeAll(async () => {
    schema = await buildSchema({
      resolvers: [SignUpFormResolver]
    });
  });

  it("Should be able to submit form with all fields", async () => {
    const mutation = `mutation {
    submitForm(formInput: {
            phone: 123
            q1: "lol"
            q2: "loll"
            q3: "haha"
            q4: "adsad"
            mailing: true
        })
        {
        email
        }
    `;
  });
});
