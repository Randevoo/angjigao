import { gql } from 'apollo-server';
import { ApolloServerTestClient, createTestClient } from 'apollo-server-testing';
import { expect } from 'chai';
import Stripe from 'stripe';

import { PrismaClient } from '@prisma/client';
import { User } from '~prisma/models';

import { insertNewUser } from '../seed/user';
import { createTestServer, resetDb } from '../utils';

const getPaymentInfoQuery = gql`
  query getPaymentInfo($stripeCustId: String!) {
    getPaymentInfo(getPaymentInfoInput: { stripe_cust_id: $stripeCustId }) {
      id
    }
  }
`;

describe.only('addPaymentInfoResolver', () => {
  let client: ApolloServerTestClient;
  let db: PrismaClient;
  let user: User;
  let stripeClient: Stripe;
  before(async () => {
    const { server, prisma, stripe } = await createTestServer();
    client = createTestClient(server);
    db = prisma;
    stripeClient = stripe;
  });

  beforeEach(async () => {
    const customer = await stripeClient.customers.create();
    user = await insertNewUser(db, customer.id);
    const token = await stripeClient.tokens.create({
      card: {
        number: '5555555555554444',
        exp_month: '11',
        exp_year: '2024',
        cvc: '333',
      },
    });
    const paymentMethod = await stripeClient.paymentMethods.create({
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
    await db.disconnect();
    console.log('db disconnected');
  });
  it('should be able to find a valid user with a given id', async () => {
    const { data, errors } = await client.query({
      query: getPaymentInfoQuery,
      variables: {
        stripeCustId: user.stripe_cust_id,
      },
    });
    expect(errors).to.be.undefined;
    const { getPaymentInfo } = data;
    expect(getPaymentInfo.id).to.not.be.undefined;
  });
});
