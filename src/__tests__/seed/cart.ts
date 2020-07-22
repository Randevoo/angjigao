import { PrismaClient, CartItemCount, User, Cart, ShopItem } from '@prisma/client';
import { ShoppingItem } from 'src/models/ShoppingItem/models';
import { sumBy, map } from 'lodash';

interface CartArgs {
  cartItemCounts?: CartItemCount[];
  owner: User;
  chargeId?: string;
}

interface CartItemCountArgs {
  cart?: Cart;
  count?: number;
  shopItem: ShopItem;
}

export async function insertNewCart(prisma: PrismaClient, args: CartArgs) {
  const { cartItemCounts, owner, chargeId } = args;
  if (cartItemCounts) {
    return await prisma.cart.create({
      data: {
        chargeId,
        cartItemCounts: { connect: map(cartItemCounts, (itemCount) => ({ id: itemCount.id })) },
        owner: {
          connect: {
            id: owner.id,
          },
        },
        price: sumBy(cartItemCounts, (itemCounts) => itemCounts.price),
      },
    });
  }
  return await prisma.cart.create({
    data: {
      chargeId,
      cartItemCounts: { create: [] },
      price: 0,
      owner: {
        connect: {
          id: owner.id,
        },
      },
    },
  });
}

export async function insertNewCartItemCount(prisma: PrismaClient, args: CartItemCountArgs) {
  const { cart, count, shopItem } = args;
  return await prisma.cartItemCount.create({
    data: {
      count: count ?? 1,
      shopItem: {
        connect: {
          id: shopItem.id,
        },
      },
      cart: {
        connect: {
          id: cart.id,
        },
      },
      price: shopItem.price * (count ?? 1),
    },
  });
}
