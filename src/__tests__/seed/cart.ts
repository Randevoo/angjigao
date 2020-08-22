import { PrismaClient, CartItemCount, User, ShopItem } from '@prisma/client';

interface CartItemCountArgs {
  ownerId: string;
  count?: number;
  shopItem: ShopItem;
}

export async function insertNewCartItemCount(prisma: PrismaClient, args: CartItemCountArgs) {
  const { ownerId, count, shopItem } = args;
  const itemCount = await prisma.cartItemCount.create({
    data: {
      count: count ?? 1,
      shopItem: {
        connect: {
          id: shopItem.id,
        },
      },
      order: {
        create: {
          owner: {
            connect: {
              id: ownerId,
            },
          },
        },
      },
      price: shopItem.price * (count ?? 1),
    },
  });
  return itemCount;
}
