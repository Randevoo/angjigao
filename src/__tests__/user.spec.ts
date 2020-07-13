import { createTestClient } from 'apollo-server-testing';
import { createTestServer } from './utils';
import { gql } from 'apollo-server';

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

describe('User', async () => {
  const { server, db } = await createTestServer();
  var { query, mutate } = createTestClient(server);
  describe('Resolvers', () => {
    it('should be able to create new user', async () => {
      const res = await mutate({
        mutation: createUserMutation,
      });
      expect(res).to;
    });
  });
});
