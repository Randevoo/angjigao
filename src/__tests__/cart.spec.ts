import { Connection } from 'typeorm';
import { createTestClient, ApolloServerTestClient } from 'apollo-server-testing';
import { createTestServer, resetDb } from './utils';
import { gql } from 'apollo-server';
import { expect } from 'chai';
import { insertNewUser, insertNewShop } from './seed/user';
import { insertNewShoppingItem } from './seed/shoppingItem';
import { insertNewCart } from './seed/cart';
import { CartItemCount } from 'src/models/Cart/Cart';

const addToCartMutation = gql`
  mutation($itemId: String!, $buyerId: String!) {
    addToCart(addToCartInput: { item_id: $itemId, buyer_id: $buyerId }) {
      id
      price
      cartItemCounts {
        item {
          id
        }
        count
        price
      }
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

  describe('Resolvers', () => {
    describe('Mutations', () => {
      describe('addToCart', () => {
        it('should be able to add to cart for a new user', async () => {
          const user = await insertNewUser(connection);
          const shop = await insertNewShop(connection);
          const item = await insertNewShoppingItem(connection, { shop });
          const { data, errors } = await client.mutate({
            mutation: addToCartMutation,
            variables: {
              itemId: item.id,
              buyerId: user.id,
            },
          });
          console.log(errors);
          expect(errors).to.be.undefined;
          const { addToCart } = data;
          expect(addToCart.id).to.not.be.undefined;
          expect(addToCart.price).to.be.equal(item.price);
          expect(addToCart.cartItemCounts).to.have.lengthOf(1);
          expect(addToCart.cartItemCounts[0].item.id).to.be.equal(item.id);
          expect(addToCart.cartItemCounts[0].count).to.be.equal(1);
          expect(addToCart.cartItemCounts[0].price).to.be.equal(item.price);
        });

        it('should be able to add to cart for a user who already has an existing item in cart', async () => {
          const user = await insertNewUser(connection);
          const shop = await insertNewShop(connection);
          const firstItem = await insertNewShoppingItem(connection, { shop });
          const secondItem = await insertNewShoppingItem(connection, { shop });
          const firstCartItem = connection.getRepository(CartItemCount).create({
            item: firstItem,
            count: 1,
            price: firstItem.price,
          });

          await insertNewCart(connection, {
            owner: user,
            cartItemCounts: [firstCartItem],
          });

          const {
            data: { addToCart },
            errors,
          } = await client.mutate({
            mutation: addToCartMutation,
            variables: {
              itemId: secondItem.id,
              buyerId: user.id,
            },
          });

          expect(errors).to.be.undefined;
          expect(addToCart.id).to.not.be.undefined;
          expect(addToCart.price).to.be.equal(firstItem.price + secondItem.price);
          expect(addToCart.cartItemCounts).to.have.lengthOf(2);
        });

        it('should be able to add to cart for a user who already the same existing item in cart', async () => {
          const user = await insertNewUser(connection);
          const shop = await insertNewShop(connection);
          const item = await insertNewShoppingItem(connection, { shop });
          const firstCartItem = connection.getRepository(CartItemCount).create({
            item: item,
            count: 1,
            price: item.price,
          });

          await insertNewCart(connection, {
            owner: user,
            cartItemCounts: [firstCartItem],
          });

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
          expect(addToCart.price).to.be.equal(item.price * 2);

          expect(addToCart.cartItemCounts).to.have.lengthOf(1);
          expect(addToCart.cartItemCounts[0].item.id).to.be.equal(item.id);
          expect(addToCart.cartItemCounts[0].count).to.be.equal(2);
          expect(addToCart.cartItemCounts[0].price).to.be.equal(2 * item.price);
        });
      });
    });
  });
});
