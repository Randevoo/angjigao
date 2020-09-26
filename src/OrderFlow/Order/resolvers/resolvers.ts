import { isNil, map } from 'lodash';
import moment from 'moment';
import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';

import { MultiOrder, OrderItemCount, ShopItem } from '~prisma/models';
import { GraphQLError } from 'graphql';
import { Context } from 'src/commonUtils';
import { shopItemLoader } from 'src/dataloaders';
import { calculatePriceFromOrder } from 'src/OrderFlow/utils';

import { AddToOrderInput, RemoveFromOrderInput } from '../inputs';
import { OrderWithPrice } from './../models';

@Resolver(() => MultiOrder)
export class MultiCartResolver {
  @Query(() => MultiOrder)
  async findMultiOrderByUserId(@Ctx() { prisma, user }: Context): Promise<Array<MultiOrder>> {
    return await prisma.multiOrder.findMany({
      where: {
        orders: {
          some: {
            ownerId: user.uid,
          },
        },
      },
    });
  }
}

@Resolver(() => OrderItemCount)
export class OrderItemCountResolver {
  @FieldResolver(() => ShopItem)
  async shopItem(
    @Root() orderItemCount: OrderItemCount,
    @Ctx() { prisma }: Context,
  ): Promise<ShopItem> {
    return await shopItemLoader(prisma).load(orderItemCount.itemId);
  }
}

@Resolver(() => OrderWithPrice)
export default class OrderResolver {
  @Query(() => [OrderWithPrice])
  async findOrdersFromOwnerId(@Ctx() { prisma, user }: Context): Promise<Array<OrderWithPrice>> {
    const orders = await prisma.order.findMany({
      where: {
        ownerId: user.uid,
      },
      include: {
        orderItemCount: {
          include: {
            shopItem: true,
          },
        },
      },
    });
    return map(orders, (order) => ({
      ...order,
      price: calculatePriceFromOrder(order),
    }));
  }

  @Mutation(() => OrderWithPrice, { nullable: true })
  async removeFromOrder(
    @Arg('removeFromOrderInput') removeFromOrderInput: RemoveFromOrderInput,
    @Ctx() { prisma }: Context,
  ): Promise<OrderWithPrice | null> {
    const orderItemCountArr = await prisma.orderItemCount.findMany({
      where: {
        AND: [
          { itemId: removeFromOrderInput.item_id },
          { order: { id: removeFromOrderInput.order_id, deletedAt: null } },
        ],
      },
      include: {
        shopItem: true,
        order: true,
      },
    });
    if (orderItemCountArr.length === 0) {
      throw new GraphQLError('Item not found in order');
    }
    const orderItemCount = orderItemCountArr[0];
    if (orderItemCount.count < 2) {
      await prisma.order.update({
        where: {
          id: orderItemCount.orderId,
        },
        data: {
          deletedAt: moment().toDate(),
        },
      });
      return null;
    }
    await prisma.orderItemCount.update({
      where: {
        id: orderItemCount.id,
      },
      data: {
        count: orderItemCount.count - 1,
      },
    });
    const order = await prisma.order.findOne({
      where: {
        id: removeFromOrderInput.order_id,
      },
      include: {
        orderItemCount: {
          include: {
            shopItem: true,
          },
        },
      },
    });

    return {
      ...order,
      price: calculatePriceFromOrder(order),
    };
  }

  @Mutation(() => OrderWithPrice)
  async addToOrder(
    @Arg('addToOrderInput') addToOrderInput: AddToOrderInput,
    @Ctx() { prisma, user }: Context,
  ): Promise<OrderWithPrice> {
    const item = await prisma.shopItem.findOne({
      where: {
        id: addToOrderInput.item_id,
      },
    });

    if (isNil(addToOrderInput.order_id)) {
      const orderItemCount = await prisma.orderItemCount.create({
        data: {
          count: 1,
          shopItem: {
            connect: {
              id: item.id,
            },
          },
          order: {
            create: {
              owner: {
                connect: {
                  id: user.uid,
                },
              },
            },
          },
        },
      });
      const updatedOrder = await prisma.order.findOne({
        where: {
          id: orderItemCount.orderId,
        },
        include: {
          orderItemCount: {
            include: {
              shopItem: true,
            },
          },
        },
      });
      return {
        ...updatedOrder,
        price: calculatePriceFromOrder(updatedOrder),
      };
    } else {
      const order = await prisma.order.findOne({
        where: {
          id: addToOrderInput.order_id,
        },
        include: {
          orderItemCount: true,
        },
      });
      await prisma.orderItemCount.update({
        where: {
          id: order.orderItemCount.id,
        },
        data: {
          count: order.orderItemCount.count + 1,
        },
      });
    }
    const updatedOrder = await prisma.order.findOne({
      where: {
        id: addToOrderInput.order_id,
      },
      include: {
        orderItemCount: {
          include: {
            shopItem: true,
          },
        },
      },
    });
    return {
      ...updatedOrder,
      price: calculatePriceFromOrder(updatedOrder),
    };
  }
}
