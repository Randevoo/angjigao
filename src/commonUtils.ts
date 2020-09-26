import * as admin from 'firebase-admin';
import Stripe from 'stripe';

import { PrismaClient } from '@prisma/client';
import {
  CreateShopItemResolver,
  CreateShopResolver,
  FindManyShopItemResolver,
  FindOneShopItemResolver,
  FindOneUserResolver,
} from '~crud';
import {
  MultiOrderRelationsResolver,
  OrderRelationsResolver,
  ShopItemRelationsResolver,
  UserRelationsResolver,
} from '~relations';
import OrderResolver from 'src/OrderFlow/Order/resolvers/resolvers';
import PaymentResolver from 'src/OrderFlow/Payment/resolvers/resolvers';
import PaymentInfoResolver from 'src/PaymentsInfo/resolvers/resolvers';
import AddressResolver from 'src/User/Address/resolvers/resolvers';
import UserResolver from 'src/User/resolvers/resolvers';

// This file is here because importing index causes index to run. We use this
// for typings and shared between test and actual initialization.

export const resolvers = [
  OrderResolver,
  FindOneUserResolver,
  OrderRelationsResolver,
  MultiOrderRelationsResolver,
  CreateShopItemResolver,
  CreateShopResolver,
  FindManyShopItemResolver,
  ShopItemRelationsResolver,
  FindOneShopItemResolver,
  UserResolver,
  UserRelationsResolver,
  PaymentInfoResolver,
  AddressResolver,
  OrderResolver,
  PaymentResolver,
];

export interface Context {
  prisma: PrismaClient;
  auth: admin.auth.Auth;
  user?: admin.auth.DecodedIdToken;
  stripe: Stripe;
}
