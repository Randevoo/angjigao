import { PrismaClient } from '@prisma/client';
import { createTestClient, ApolloServerTestClient } from 'apollo-server-testing';
import { createTestServer, resetDb } from './utils';
import { gql } from 'apollo-server';
import { expect } from 'chai';
import { insertNewUser, insertNewShop } from './seed/user';
import { insertNewShoppingItem } from './seed/shoppingItem';
import { insertNewCart, insertNewCartItemCount } from './seed/cart';

const removeFromCartMutation = gql`
  mutation($itemId: String!, $buyerId: String!) {
    removeFromCart(removeFromCartInput: { item_id: $itemId, buyer_id: $buyerId }) {
      id
      cartItemCounts {
        shopItem {
          id
        }
        count
        price
      }
      price
    }
  }
`;

const addToCartMutation = gql`
  mutation($itemId: String!, $buyerId: String!) {
    addToCart(addToCartInput: { item_id: $itemId, buyer_id: $buyerId }) {
      id
      price
      cartItemCounts {
        shopItem {
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
    describe('Mutations', () => {
      describe('removeFromCart', () => {
        it('should be able to remove from cart of an already existing item', async () => {
          const user = await insertNewUser(db);
          const shop = await insertNewShop(db);
          const shopItem = await insertNewShoppingItem(db, { shop });
          await insertNewCartItemCount(db, {
            shopItem,
            count: 2,
            cart: user.cart,
          });

          const { data, errors } = await client.mutate({
            mutation: removeFromCartMutation,
            variables: {
              itemId: shopItem.id,
              buyerId: user.id,
            },
          });
          expect(errors).to.be.undefined;
          const { removeFromCart } = data;
          expect(removeFromCart.id).to.not.be.undefined;
          expect(removeFromCart.price).to.be.equal(shopItem.price);
          expect(removeFromCart.cartItemCounts).to.have.lengthOf(1);
          expect(removeFromCart.cartItemCounts[0].shopItem.id).to.be.equal(shopItem.id);
          expect(removeFromCart.cartItemCounts[0].count).to.be.equal(1);
          expect(removeFromCart.cartItemCounts[0].price).to.be.equal(shopItem.price);
        });
        it.only('should be able to remove from cart from an item which only has count of one', async () => {
          const user = await insertNewUser(db);
          const shop = await insertNewShop(db);
          const shopItem = await insertNewShoppingItem(db, { shop });
          await insertNewCartItemCount(db, {
            shopItem,
            count: 1,
            cart: user.cart,
          });

          const { data, errors } = await client.mutate({
            mutation: removeFromCartMutation,
            variables: {
              itemId: shopItem.id,
              buyerId: user.id,
            },
          });
          console.log(errors);
          expect(errors).to.be.undefined;
          const { removeFromCart } = data;
          expect(removeFromCart.id).to.not.be.undefined;
          expect(removeFromCart.price).to.be.equal(shopItem.price);
          console.log();
          expect(removeFromCart.cartItemCounts).to.be.empty;
        });
      });
      describe('addToCart', () => {
        it('should be able to add to cart for a new user', async () => {
          const user = await insertNewUser(db);
          const shop = await insertNewShop(db);
          const item = await insertNewShoppingItem(db, { shop });
          const { data, errors } = await client.mutate({
            mutation: addToCartMutation,
            variables: {
              itemId: item.id,
              buyerId: user.id,
            },
          });

          expect(errors).to.be.undefined;
          const { addToCart } = data;
          expect(addToCart.id).to.not.be.undefined;
          expect(addToCart.price).to.be.equal(item.price);
          expect(addToCart.cartItemCounts).to.have.lengthOf(1);
          expect(addToCart.cartItemCounts[0].shopItem.id).to.be.equal(item.id);
          expect(addToCart.cartItemCounts[0].count).to.be.equal(1);
          expect(addToCart.cartItemCounts[0].price).to.be.equal(item.price);
        });

        it('should be able to add to cart for a user who already has an existing item in cart', async () => {
          const user = await insertNewUser(db);
          const shop = await insertNewShop(db);
          const firstItem = await insertNewShoppingItem(db, { shop });
          const secondItem = await insertNewShoppingItem(db, { shop });

          await insertNewCartItemCount(db, {
            shopItem: firstItem,
            count: 1,
            cart: user.cart,
          });

          const { data, errors } = await client.mutate({
            mutation: addToCartMutation,
            variables: {
              itemId: secondItem.id,
              buyerId: user.id,
            },
          });

          expect(errors).to.be.undefined;
          const { addToCart } = data;
          expect(addToCart.id).to.not.be.undefined;
          expect(addToCart.price).to.be.equal(firstItem.price + secondItem.price);
          expect(addToCart.cartItemCounts).to.have.lengthOf(2);
        });

        it('should be able to add to cart for a user who already the same existing item in cart', async () => {
          const user = await insertNewUser(db);
          const shop = await insertNewShop(db);
          const shopItem = await insertNewShoppingItem(db, { shop });

          await insertNewCartItemCount(db, {
            shopItem,
            count: 1,
            cart: user.cart,
          });

          const {
            data: { addToCart },
            errors,
          } = await client.mutate({
            mutation: addToCartMutation,
            variables: {
              itemId: shopItem.id,
              buyerId: user.id,
            },
          });

          expect(errors).to.be.undefined;
          expect(addToCart.id).to.not.be.undefined;
          expect(addToCart.price).to.be.equal(shopItem.price * 2);

          expect(addToCart.cartItemCounts).to.have.lengthOf(1);
          expect(addToCart.cartItemCounts[0].shopItem.id).to.be.equal(shopItem.id);
          expect(addToCart.cartItemCounts[0].count).to.be.equal(2);
          expect(addToCart.cartItemCounts[0].price).to.be.equal(2 * shopItem.price);
        });
      });
    });
  });
});
