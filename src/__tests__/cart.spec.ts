import { PrismaClient } from '@prisma/client';
import { createTestClient, ApolloServerTestClient } from 'apollo-server-testing';
import { createTestServer, resetDb } from './utils';
import { gql } from 'apollo-server';
import { expect } from 'chai';
import { insertNewUser, insertNewShop } from './seed/user';
import { insertNewShoppingItem } from './seed/shoppingItem';
import { insertNewCartItemCount } from './seed/cart';

const removeFromOrderMutation = gql`
  mutation($itemId: String!, $buyerId: String!) {
    removeFromOrder(removeFromOrderInput: { item_id: $itemId, buyer_id: $buyerId }) {
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

const addToOrderMutation = gql`
  mutation($itemId: String!, $buyerId: String!) {
    addToOrder(addToOrderInput: { item_id: $itemId, buyer_id: $buyerId }) {
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
            ownerId: user.id,
          });

          const { data, errors } = await client.mutate({
            mutation: removeFromOrderMutation,
            variables: {
              itemId: shopItem.id,
              buyerId: user.id,
            },
          });
          expect(errors).to.be.undefined;
          const { removeFromOrder } = data;
          expect(removeFromOrder.id).to.not.be.undefined;
          expect(removeFromOrder.price).to.be.equal(shopItem.price);
          expect(removeFromOrder.cartItemCount.shopItem.id).to.be.equal(shopItem.id);
          expect(removeFromOrder.cartItemCount.count).to.be.equal(1);
          expect(removeFromOrder.cartItemCount.price).to.be.equal(shopItem.price);
        });
        it('should be able to remove from order from an item which only has count of one', async () => {
          const user = await insertNewUser(db);
          const shop = await insertNewShop(db);
          const shopItem = await insertNewShoppingItem(db, { shop });
          await insertNewCartItemCount(db, {
            shopItem,
            count: 1,
            ownerId: user.id,
          });

          const { data, errors } = await client.mutate({
            mutation: removeFromOrderMutation,
            variables: {
              itemId: shopItem.id,
              buyerId: user.id,
            },
          });
          console.log(errors);
          expect(errors).to.be.undefined;
          const { removeFromOrder } = data;
          expect(removeFromOrder.id).to.not.be.undefined;
          expect(removeFromOrder.price).to.be.equal(0);
        });
      });
      describe('addToCart', () => {
        it('should be able to add to order for a user', async () => {
          const user = await insertNewUser(db);
          const shop = await insertNewShop(db);
          const item = await insertNewShoppingItem(db, { shop });
          const { data, errors } = await client.mutate({
            mutation: addToOrderMutation,
            variables: {
              itemId: item.id,
              buyerId: user.id,
            },
          });

          expect(errors).to.be.undefined;
          const { addToOrder } = data;
          expect(addToOrder).to.have.lengthOf(1);
          expect(addToOrder[0].id).to.not.be.undefined;
          expect(addToOrder[0].price).to.be.equal(item.price);
          expect(addToOrder[0].cartItemCount).to.not.be.undefined;
          expect(addToOrder[0].cartItemCount.shopItem.id).to.be.equal(item.id);
          expect(addToOrder[0].cartItemCount.count).to.be.equal(1);
          expect(addToOrder[0].cartItemCount.price).to.be.equal(item.price);
        });

        it('should be able to add to cart for a user who already has an existing item in order', async () => {
          const user = await insertNewUser(db);
          const shop = await insertNewShop(db);
          const firstItem = await insertNewShoppingItem(db, { shop });
          const secondItem = await insertNewShoppingItem(db, { shop });

          await insertNewCartItemCount(db, {
            shopItem: firstItem,
            count: 1,
            ownerId: user.id,
          });

          const { data, errors } = await client.mutate({
            mutation: addToOrderMutation,
            variables: {
              itemId: secondItem.id,
              buyerId: user.id,
            },
          });

          expect(errors).to.be.undefined;
          const { addToOrder } = data;
          expect(addToOrder).to.have.lengthOf(2);
        });

        it('should be able to add to cart for a user who already the same existing item in order', async () => {
          const user = await insertNewUser(db);
          const shop = await insertNewShop(db);
          const shopItem = await insertNewShoppingItem(db, { shop });

          await insertNewCartItemCount(db, {
            shopItem,
            count: 1,
            ownerId: user.id,
          });

          const {
            data: { addToOrder },
            errors,
          } = await client.mutate({
            mutation: addToOrderMutation,
            variables: {
              itemId: shopItem.id,
              buyerId: user.id,
            },
          });

          expect(errors).to.be.undefined;
          expect(addToOrder).to.have.lengthOf(1);
          expect(addToOrder[0].cartItemCount.shopItem.id).to.be.equal(shopItem.id);
          expect(addToOrder[0].cartItemCount.count).to.be.equal(2);
          expect(addToOrder[0].cartItemCount.price).to.be.equal(2 * shopItem.price);
        });
      });
    });
  });
});
