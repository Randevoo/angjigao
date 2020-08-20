import admin from 'firebase-admin';
import { PrismaClient } from '@prisma/client';
import { createTestClient, ApolloServerTestClient } from 'apollo-server-testing';
import { createTestServer, resetDb } from './utils';
import { gql } from 'apollo-server';
import { expect } from 'chai';
import { insertNewUser } from './seed/user';
import Stripe from 'stripe';
import moment from 'moment';

const signUpUserMutation = gql`
  mutation signUpUser(
    $email: String!
    $password: String!
    $displayName: String!
    $firstName: String!
    $lastName: String!
    $dob: DateTime!
  ) {
    signUp(
      signUpInput: {
        email: $email
        password: $password
        displayName: $displayName
        firstName: $firstName
        lastName: $lastName
        dob: $dob
      }
    ) {
      id
    }
  }
`;

const findUserByIdQuery = gql`
  query findUserById($id: String!) {
    findUserById(id: $id) {
      id
    }
  }
`;

describe('User', () => {
  let client: ApolloServerTestClient;
  let db: PrismaClient;
  let stripeClient: Stripe;
  let fbAuth: admin.auth.Auth;
  before(async () => {
    const { server, prisma, stripe, auth } = await createTestServer();
    client = createTestClient(server);
    db = prisma;
    stripeClient = stripe;
    fbAuth = auth;
  });

  afterEach(async () => {
    await resetDb();
  });

  after(async () => {
    await db.disconnect();
    console.log('db disconnected');
  });

  describe('Resolvers', () => {
    describe('Queries', () => {
      describe('findUserById', () => {
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
    describe('Mutation', () => {
      afterEach(async () => {
        const allUsers = await fbAuth.listUsers(5);
        const allUsersUid = allUsers.users.map((user) => user.uid);
        await fbAuth.deleteUsers(allUsersUid);
      });

      describe.only('signUpUser', () => {
        it('should be able to sign up user with the correct data', async () => {
          const { data, errors } = await client.mutate({
            mutation: signUpUserMutation,
            variables: {
              email: 'test@e.com',
              password: 'asdasdasdasd',
              displayName: 'asd',
              firstName: 'asd',
              lastName: 'asd',
              dob: moment().toISOString(),
            },
          });
          expect(errors).to.be.undefined;
          const { signUp } = data;
          expect(signUp.id).to.not.be.undefined;
        });
      });
    });
  });
});
