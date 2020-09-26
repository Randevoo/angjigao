import { gql } from 'apollo-server';
import { ApolloServerTestClient, createTestClient } from 'apollo-server-testing';
import { expect } from 'chai';

import { PrismaClient } from '@prisma/client';
import { User } from '~prisma/models';

import { insertNewOrderItemCount } from './seed/order';
import { insertNewShopItem } from './seed/shopItem';
import { insertNewShop } from './seed/user';
import { createTestServerWithUser, resetDb } from './utils';

const removeFromOrderMutation = gql`
  mutation($itemId: String!, $orderId: String!) {
    removeFromOrder(removeFromOrderInput: { item_id: $itemId, order_id: $orderId }) {
      id
      orderItemCount {
        shopItem {
          id
        }
        count
      }
      price
    }
  }
`;

const addToOrderMutation = gql`
  mutation($itemId: String!, $orderId: String) {
    addToOrder(addToOrderInput: { item_id: $itemId, order_id: $orderId }) {
      id
      price
      orderItemCount {
        shopItem {
          id
        }
        count
      }
      price
    }
  }
`;

describe.only('Order', () => {
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
    describe('Mutations', () => {
      describe('removeFromOrder', () => {
        it('should be able to remove from order of an already existing item', async () => {
          const shop = await insertNewShop(db);
          const shopItem = await insertNewShopItem(db, { shop });
          const orderItemCount = await insertNewOrderItemCount(db, {
            shopItem,
            count: 2,
            ownerId: user.id,
          });

          const { data, errors } = await client.mutate({
            mutation: removeFromOrderMutation,
            variables: {
              itemId: shopItem.id,
              orderId: orderItemCount.orderId,
            },
          });

          expect(errors).to.be.undefined;
          const { removeFromOrder } = data;
          expect(removeFromOrder.id).to.not.be.undefined;
          expect(removeFromOrder.price).to.be.equal(shopItem.price);
          expect(removeFromOrder.orderItemCount.shopItem.id).to.be.equal(shopItem.id);
        });
        it('should be able to remove from order from an item which only has count of one', async () => {
          const shop = await insertNewShop(db);
          const shopItem = await insertNewShopItem(db, { shop });
          const orderItemCount = await insertNewOrderItemCount(db, {
            shopItem,
            count: 1,
            ownerId: user.id,
          });

          const { data, errors } = await client.mutate({
            mutation: removeFromOrderMutation,
            variables: {
              itemId: shopItem.id,
              orderId: orderItemCount.orderId,
            },
          });

          expect(errors).to.be.undefined;
          const { removeFromOrder } = data;
          expect(removeFromOrder).to.be.null;
        });
      });
      describe('addToOrder', () => {
        it('should be able to add to order for a user', async () => {
          const shop = await insertNewShop(db);
          const item = await insertNewShopItem(db, { shop });
          const { data, errors } = await client.mutate({
            mutation: addToOrderMutation,
            variables: {
              itemId: item.id,
            },
          });
          console.log(errors);
          expect(errors).to.be.undefined;

          const { addToOrder } = data;
          expect(addToOrder.id).to.not.be.undefined;
          expect(addToOrder.price).to.be.equal(item.price);
          expect(addToOrder.orderItemCount).to.not.be.undefined;
          expect(addToOrder.orderItemCount.shopItem.id).to.be.equal(item.id);
          expect(addToOrder.orderItemCount.count).to.be.equal(1);
        });

        it('should be able to add to cart for a user who already has an existing item in order', async () => {
          const shop = await insertNewShop(db);
          const firstItem = await insertNewShopItem(db, { shop });
          const secondItem = await insertNewShopItem(db, { shop });

          await insertNewOrderItemCount(db, {
            shopItem: firstItem,
            count: 1,
            ownerId: user.id,
          });

          const { data, errors } = await client.mutate({
            mutation: addToOrderMutation,
            variables: {
              itemId: secondItem.id,
            },
          });

          expect(errors).to.be.undefined;
          const { addToOrder } = data;
          expect(addToOrder.price).to.be.equal(secondItem.price);
        });

        it('should be able to add to cart for a user who already the same existing item in order', async () => {
          const shop = await insertNewShop(db);
          const shopItem = await insertNewShopItem(db, { shop });

          const orderItemCount = await insertNewOrderItemCount(db, {
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
              orderId: orderItemCount.orderId,
            },
          });

          expect(errors).to.be.undefined;
          expect(addToOrder.orderItemCount.shopItem.id).to.be.equal(shopItem.id);
          expect(addToOrder.orderItemCount.count).to.be.equal(2);
          expect(addToOrder.price).to.be.equal(2 * shopItem.price);
        });
      });
    });
  });
});
