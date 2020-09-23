import { gql } from 'apollo-server';
import { ApolloServerTestClient, createTestClient } from 'apollo-server-testing';
import { expect } from 'chai';

import { PrismaClient } from '@prisma/client';
import { User } from '~prisma/models';

import { insertNewAddress } from '../seed/address';
import { createTestServerWithUser, resetDb } from '../utils';

const addAddressMutation = gql`
  mutation addAddress(
    $country: String!
    $city: String!
    $line1: String!
    $line2: String!
    $postal_code: String!
    $state: String!
    $default: Boolean!
  ) {
    addAddress(
      addAddressInput: {
        city: $city
        state: $state
        line1: $line1
        line2: $line2
        postal_code: $postal_code
        default: $default
        country: $country
      }
    ) {
      id
      line1
    }
  }
`;

const removeAddressMutation = gql`
  mutation removeAddress($id: String!) {
    removeAddress(addAddressInput: { id: $id }) {
      id
    }
  }
`;

const updateDefaultAddressMutation = gql`
  mutation updateDefaultAddress($id: String!) {
    updateDefaultAddress(updateDefaultAddressInput: { id: $id }) {
      id
    }
  }
`;

describe('User', () => {
  let client: ApolloServerTestClient;
  let db: PrismaClient;
  let user: User;
  beforeEach(async () => {
    const { server, prisma, testUser } = await createTestServerWithUser();
    client = createTestClient(server);
    db = prisma;
    user = testUser;
  });

  afterEach(async () => {
    await resetDb();
  });

  after(async () => {
    await db.$disconnect();
  });

  describe('Resolvers', () => {
    describe('Mutation', () => {
      describe('updateDefaultAddress', () => {
        it('should be able update default address of user', async () => {
          await insertNewAddress(db, user.id, true);
          const addrToBeDefaulted = await insertNewAddress(db, user.id, false);
          const { data, errors } = await client.mutate({
            mutation: updateDefaultAddressMutation,
            variables: {
              id: addrToBeDefaulted.id,
            },
          });
          expect(errors).to.be.undefined;
          const { updateDefaultAddress } = data;
          expect(updateDefaultAddress.id).to.be.equal(addrToBeDefaulted.id);
          const removedAddrUser = await db.user.findOne({
            where: {
              id: user.id,
            },
          });
          expect(removedAddrUser.defaultAddressId).to.be.equal(addrToBeDefaulted.id);
        });
      });
      describe('removeAddress', () => {
        it('should be able to remove default address from user', async () => {
          const addrToBeRemoved = await insertNewAddress(db, user.id, true);
          const { data, errors } = await client.mutate({
            mutation: removeAddressMutation,
            variables: {
              id: addrToBeRemoved.id,
            },
          });
          expect(errors).to.be.undefined;
          const { removeAddress } = data;
          expect(removeAddress.id).to.be.equal(addrToBeRemoved.id);
          const removedAddrUser = await db.user.findOne({
            where: {
              id: user.id,
            },
          });
          expect(removedAddrUser.defaultAddressId).to.be.null;
        });
      });
      describe('addAddress', () => {
        it('should be able to add first address to user as default', async () => {
          const { data, errors } = await client.mutate({
            mutation: addAddressMutation,
            variables: {
              city: 'Singapore',
              state: 'Singapore',
              line1: 'asd',
              line2: 'asd',
              postal_code: 'asd',
              default: true,
              country: 'Singapore',
            },
          });

          expect(errors).to.be.undefined;
          const { addAddress } = data;
          expect(addAddress[0].line1).be.equal('asd');
          const userWithAddress = await db.user.findOne({
            where: {
              id: user.id,
            },
            include: {
              addresses: true,
            },
          });
          expect(userWithAddress.addresses).to.have.lengthOf(1);
          expect(userWithAddress.defaultAddressId).to.be.equal(addAddress[0].id);
        });

        it('should be able to add address to user as non- default', async () => {
          const { data, errors } = await client.mutate({
            mutation: addAddressMutation,
            variables: {
              city: 'Singapore',
              state: 'Singapore',
              line1: 'asd',
              line2: 'asd',
              postal_code: 'asd',
              default: false,
              country: 'Singapore',
            },
          });

          expect(errors).to.be.undefined;
          const { addAddress } = data;
          expect(addAddress[0].line1).be.equal('asd');
          const userWithAddress = await db.user.findOne({
            where: {
              id: user.id,
            },
            include: {
              addresses: true,
            },
          });
          expect(userWithAddress.addresses).to.have.lengthOf(1);
          expect(userWithAddress.defaultAddressId).to.be.null;
        });
      });
    });
  });
});
