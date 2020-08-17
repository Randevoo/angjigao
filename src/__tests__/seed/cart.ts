import { PrismaClient, CartItemCount, User, Cart, ShopItem } from '@prisma/client';

interface CartArgs {
  cartItemCounts?: CartItemCount[];
  owner: User;
  paymentIntentId?: string;
}

interface CartItemCountArgs {
  cart: Cart;
  count?: number;
  shopItem: ShopItem;
}

export async function insertNewCart(prisma: PrismaClient, args: CartArgs) {
  const { owner, paymentIntentId } = args;

  return await prisma.cart.create({
    data: {
      paymentIntentId,
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
  const itemCount = await prisma.cartItemCount.create({
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
  const price = (
    await prisma.cart.findOne({
      where: {
        id: cart.id,
      },
    })
  ).price;
  await prisma.cart.update({
    where: {
      id: cart.id,
    },
    data: {
      price: price + shopItem.price,
    },
  });
  return itemCount;
}
