import { Connection } from 'typeorm';
import { createTestClient, ApolloServerTestClient } from 'apollo-server-testing';
import { createTestServer } from './utils';
import { gql } from 'apollo-server';
import { expect } from 'chai';

const createUserMutation = gql`
  mutation {
    createUser(
      userInput: { username: "Test1", password: "Test1", dob: "2020-07-13T14:21:23+0000" }
    ) {
      username
      dob
    }
  }
`;

describe('User', () => {
  let client: ApolloServerTestClient;
  let connection: Connection;
  before(async () => {
    const { server, db } = await createTestServer();
    client = createTestClient(server);
    connection = db;
  });

  describe('Resolvers', () => {
    it('should be able to create new user', async () => {
      const {
        data: { createUser },
      } = await client.mutate({
        mutation: createUserMutation,
      });
      expect(createUser.username).to.be.equal('Test1');
      expect(createUser.dob).to.be.equal('2020-07-13T14:21:23.000Z');
    });
  });
});
