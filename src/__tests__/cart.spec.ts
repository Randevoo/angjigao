import { Order } from 'src/models/Order/models';
import { Connection, Db } from 'typeorm';
import { createTestClient, ApolloServerTestClient } from 'apollo-server-testing';
import { createTestServer, resetDb } from './utils';
import { gql } from 'apollo-server';
import { expect } from 'chai';
import { insertNewUser, insertNewShop } from './seed/user';
import { insertNewShoppingItem } from './seed/shoppingItem';
import { first } from 'lodash';

const addToCartMutation = gql`
  mutation($itemId: String!, $buyerId: String!) {
    addToCart(addToCartInput: { item_id: $itemId, buyer_id: $buyerId }) {
      id
    }
  }
`;

describe('Cart', () => {
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

  describe.only('Resolvers', () => {
    it('should be able to add to cart for a new user', async () => {
      const user = await insertNewUser(connection);
      const shop = await insertNewShop(connection);
      const item = await insertNewShoppingItem(connection, { shop });
      const {
        data: { addToCart },
        errors,
      } = await client.mutate({
        mutation: addToCartMutation,
        variables: {
          itemId: item.id,
          buyerId: user.id,
        },
      });
      expect(errors).to.be.undefined;
      expect(addToCart.id).to.not.be.undefined;
      const order = await connection.getRepository(Order).findOne({
        where: {
          cart: {
            id: addToCart.id,
          },
        },
      });
      expect(order).to.not.be.undefined;
      console.log(order);
    });
  });
});
