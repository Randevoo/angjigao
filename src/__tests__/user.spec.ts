import { Connection, Db } from 'typeorm';
import { createTestClient, ApolloServerTestClient } from 'apollo-server-testing';
import { createTestServer, resetDb } from './utils';
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

  afterEach(async () => {
    await resetDb(connection);
  });

  after(async () => {
    await connection.close();
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

    it('should not be able to create new users with duplicate names', async () => {
      await client.mutate({
        mutation: createUserMutation,
      });
      const { data, errors } = await client.mutate({
        mutation: createUserMutation,
      });
      expect(data).to.be.null;
      expect(errors).to.be.lengthOf(1);
    });
  });
});
