import { PrismaClient } from '@prisma/client';
import { createTestClient, ApolloServerTestClient } from 'apollo-server-testing';
import { createTestServer, resetDb } from './utils';
import { gql } from 'apollo-server';
import { expect } from 'chai';
import { insertNewUser } from './seed/user';

const findUserByIdQuery = gql`
  query findUserById($id: String!) {
    findUserById(id: $id) {
      id
    }
  }
`;

describe('Cart', () => {
  let client: ApolloServerTestClient;
  let db: PrismaClient;
  before(async () => {
    const { server, prisma } = await createTestServer();
    client = createTestClient(server);
    db = prisma;
  });

  afterEach(async () => {
    await resetDb();
  });

  after(async () => {
    await db.disconnect();
  });

  describe('Resolvers', () => {
    describe('Queries', () => {
      describe('fidnUserById', () => {
        it('should be able to find a valid user with a given id', async () => {
          const user = await insertNewUser(db);
          const { data, errors } = await client.query({
            query: findUserByIdQuery,
            variables: {
              id: user.id,
            },
          });
          expect(errors).to.be.undefined;
          const { findUserById } = data;
          expect(findUserById.id).to.not.be.undefined;
          expect(findUserById.id).to.be.equal(user.id);
        });
      });
    });
  });
});
