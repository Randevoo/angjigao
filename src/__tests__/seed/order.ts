import { PrismaClient, ShopItem } from '@prisma/client';
import { OrderItemCount } from '~prisma/models';

interface OrderItemCountArgs {
  ownerId: string;
  count?: number;
  shopItem: ShopItem;
}

export async function insertNewOrderItemCount(
  prisma: PrismaClient,
  args: OrderItemCountArgs,
): Promise<OrderItemCount> {
  const { ownerId, count, shopItem } = args;
  const itemCount = await prisma.orderItemCount.create({
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
    },
    include: {
      order: true,
    },
  });
  return itemCount;
}
