import { PrismaClient } from '@prisma/client';
import * as admin from 'firebase-admin';
// This file is here because importing index causes index to run. We use this
// for typings and shared between test and actual initialization.
import UserResolver from 'src/User/resolvers/resolvers';
import CartResolver from 'src/Cart/resolvers/resolvers';
import { UserRelationsResolver } from '~prisma/resolvers/relations/User/UserRelationsResolver';
import { FindOneShopItemResolver } from '~prisma/resolvers/crud/ShopItem/FindOneShopItemResolver';
import { ShopItemRelationsResolver } from '~prisma/resolvers/relations/ShopItem/ShopItemRelationsResolver';
import { FindManyShopItemResolver } from '~prisma/resolvers/crud/ShopItem/FindManyShopItemResolver';
import { CreateShopResolver } from '~prisma/resolvers/crud/Shop/CreateShopResolver';
import { CreateShopItemResolver } from '~prisma/resolvers/crud/ShopItem/CreateShopItemResolver';
import { MultiCartRelationsResolver } from '~prisma/resolvers/relations/MultiCart/MultiCartRelationsResolver';
import { CartRelationsResolver } from '~prisma/resolvers/relations/Cart/CartRelationsResolver';
import { FindOneUserResolver } from '~prisma/resolvers/crud/User/FindOneUserResolver';
import Stripe from 'stripe';

export const resolvers = [
  CartResolver,
  FindOneUserResolver,
  CartRelationsResolver,
  MultiCartRelationsResolver,
  CreateShopItemResolver,
  CreateShopResolver,
  FindManyShopItemResolver,
  ShopItemRelationsResolver,
  FindOneShopItemResolver,
  UserResolver,
  UserRelationsResolver,
];

export interface Context {
  prisma: PrismaClient;
  auth: admin.auth.Auth;
  user?: admin.auth.DecodedIdToken;
  stripe: Stripe;
}
