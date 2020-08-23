import { MultiOrderRelationsResolver } from './../prisma/generated/type-graphql/resolvers/relations/MultiOrder/MultiOrderRelationsResolver';
import { OrderRelationsResolver } from './../prisma/generated/type-graphql/resolvers/relations/Order/OrderRelationsResolver';
import { PrismaClient } from '@prisma/client';
import * as admin from 'firebase-admin';
// This file is here because importing index causes index to run. We use this
// for typings and shared between test and actual initialization.
import UserResolver from 'src/User/resolvers/resolvers';
import CartResolver from 'src/Order/resolvers/resolvers';
import { UserRelationsResolver } from '~prisma/resolvers/relations/User/UserRelationsResolver';
import { FindOneShopItemResolver } from '~prisma/resolvers/crud/ShopItem/FindOneShopItemResolver';
import { ShopItemRelationsResolver } from '~prisma/resolvers/relations/ShopItem/ShopItemRelationsResolver';
import { FindManyShopItemResolver } from '~prisma/resolvers/crud/ShopItem/FindManyShopItemResolver';
import { CreateShopResolver } from '~prisma/resolvers/crud/Shop/CreateShopResolver';
import { CreateShopItemResolver } from '~prisma/resolvers/crud/ShopItem/CreateShopItemResolver';
import { FindOneUserResolver } from '~prisma/resolvers/crud/User/FindOneUserResolver';
import Stripe from 'stripe';
import PaymentResolver from './Payments/resolvers/resolvers';

export const resolvers = [
  CartResolver,
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
  PaymentResolver,
];

export interface Context {
  prisma: PrismaClient;
  auth: admin.auth.Auth;
  user?: admin.auth.DecodedIdToken;
  stripe: Stripe;
}
