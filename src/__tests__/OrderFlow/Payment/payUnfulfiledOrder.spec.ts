import { gql } from 'apollo-server';
import { ApolloServerTestClient, createTestClient } from 'apollo-server-testing';
import { expect } from 'chai';
import Stripe from 'stripe';

import { PrismaClient } from '@prisma/client';
import { Address, User } from '~prisma/models';
import { insertNewAddress } from 'src/__tests__/seed/address';
import { insertNewOrderItemCount } from 'src/__tests__/seed/order';
import { insertNewShopItem } from 'src/__tests__/seed/shopItem';
import { insertNewShop } from 'src/__tests__/seed/user';
import { createTestServerWithUser, resetDb } from 'src/__tests__/utils';

const payUnfulfilledOrderMutation = gql`
  mutation payUnfulfilledOrder(
    $order_id: String!
    $payment_method_id: String!
    $address_id: String!
  ) {
    payload: payUnfulfilledOrder(
      payUnfulfilledOrderInput: {
        order_id: $order_id
        payment_method_id: $payment_method_id
        address_id: $address_id
      }
    ) {
      id
      orderId
      paymentIntentId
      order {
        id
      }
      orderDeliveryStatus {
        id
      }
    }
  }
`;

describe('payUnfulfiledOrder resolver', () => {
  let client: ApolloServerTestClient;
  let db: PrismaClient;
  let user: User;
  let address: Address;
  let stripeClient: Stripe;
  let paymentMethod: Stripe.PaymentMethod;

  beforeEach(async () => {
    const { server, prisma, stripe, testUser } = await createTestServerWithUser();
    client = createTestClient(server);
    db = prisma;
    stripeClient = stripe;
    user = testUser;

    address = await insertNewAddress(db, user.id);
    const customer = await stripeClient.customers.create();
    user = await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        stripe_cust_id: customer.id,
      },
    });

    const token = await stripeClient.tokens.create({
      card: {
        number: '5555555555554444',
        exp_month: '11',
        exp_year: '2024',
        cvc: '333',
      },
    });
    paymentMethod = await stripeClient.paymentMethods.create({
      type: 'card',
      card: {
        token: token.id,
      },
    });

    await stripeClient.paymentMethods.attach(paymentMethod.id, {
      customer: user.stripe_cust_id,
    });
  });

  afterEach(async () => {
    await resetDb();
  });

  after(async () => {
    await db.$disconnect();
    console.log('db disconnected');
  });
  it('should be able to pay for order at the correct price', async () => {
    const shop = await insertNewShop(db);
    const shopItem = await insertNewShopItem(db, {
      shop,
      price: 20,
    });
    const orderItemCount = await insertNewOrderItemCount(db, {
      ownerId: user.id,
      shopItem: shopItem,
      count: 2,
    });
    const orderId = orderItemCount.orderId;

    const { data, errors } = await client.mutate({
      mutation: payUnfulfilledOrderMutation,
      variables: {
        order_id: orderId,
        payment_method_id: paymentMethod.id,
        address_id: address.id,
      },
    });
    console.log(errors);
    expect(errors).to.be.undefined;
    const { payload } = data;
    expect(payload.id).to.not.be.undefined;
    expect(payload.orderId).to.be.equal(orderId);
  });
});
