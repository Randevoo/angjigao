import * as admin from 'firebase-admin';
import Stripe from 'stripe';

import { PrismaClient } from '@prisma/client';
import { CreateShopResolver } from '~prisma/resolvers/crud/Shop/CreateShopResolver';
import { CreateShopItemResolver } from '~prisma/resolvers/crud/ShopItem/CreateShopItemResolver';
import { FindManyShopItemResolver } from '~prisma/resolvers/crud/ShopItem/FindManyShopItemResolver';
import { FindOneShopItemResolver } from '~prisma/resolvers/crud/ShopItem/FindOneShopItemResolver';
import { FindOneUserResolver } from '~prisma/resolvers/crud/User/FindOneUserResolver';
import { MultiOrderRelationsResolver } from '~prisma/resolvers/relations/MultiOrder/MultiOrderRelationsResolver';
import { OrderRelationsResolver } from '~prisma/resolvers/relations/Order/OrderRelationsResolver';
import { ShopItemRelationsResolver } from '~prisma/resolvers/relations/ShopItem/ShopItemRelationsResolver';
import { UserRelationsResolver } from '~prisma/resolvers/relations/User/UserRelationsResolver';
import OrderResolver from 'src/OrderFlow/Order/resolvers/resolvers';
import PaymentResolver from 'src/Payments/resolvers/resolvers';
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
  PaymentResolver,
  AddressResolver,
  OrderResolver,
];

export interface Context {
  prisma: PrismaClient;
  auth: admin.auth.Auth;
  user?: admin.auth.DecodedIdToken;
  stripe: Stripe;
}
