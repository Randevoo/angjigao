import { PrismaClient } from '@prisma/client';
import { createTestClient, ApolloServerTestClient } from 'apollo-server-testing';
import { createTestServer, resetDb } from './utils';
import { gql } from 'apollo-server';
import { expect } from 'chai';
import { insertNewUser, insertNewShop } from './seed/user';
import { insertNewShoppingItem } from './seed/shoppingItem';
import { insertNewCart, insertNewCartItemCount } from './seed/cart';

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
  let prisma: PrismaClient;
  before(async () => {
    const { server, prisma } = await createTestServer();
    client = createTestClient(server);
  });

  afterEach(async () => {
    await resetDb();
  });

  after(async () => {
    await prisma.disconnect();
  });

  describe('Resolvers', () => {
    describe('Mutations', () => {
      describe('addToCart', () => {
        it('should be able to add to cart for a new user', async () => {
          const user = await insertNewUser(prisma);
          const shop = await insertNewShop(prisma);
          const item = await insertNewShoppingItem(prisma, { shop });
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
          const user = await insertNewUser(prisma);
          const shop = await insertNewShop(prisma);
          const firstItem = await insertNewShoppingItem(prisma, { shop });
          const secondItem = await insertNewShoppingItem(prisma, { shop });
          const firstCartItem = await insertNewCartItemCount(prisma, {
            shopItem: firstItem,
            count: 1,
          });

          await insertNewCart(prisma, {
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
          const user = await insertNewUser(prisma);
          const shop = await insertNewShop(prisma);
          const shopItem = await insertNewShoppingItem(prisma, { shop });
          const firstCartItem = await insertNewCartItemCount(prisma, {
            shopItem,
            count: 1,
          });

          await insertNewCart(prisma, {
            owner: user,
            cartItemCounts: [firstCartItem],
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
          expect(addToCart.cartItemCounts[0].item.id).to.be.equal(shopItem.id);
          expect(addToCart.cartItemCounts[0].count).to.be.equal(2);
          expect(addToCart.cartItemCounts[0].price).to.be.equal(2 * shopItem.price);
        });
      });
    });
  });
});
