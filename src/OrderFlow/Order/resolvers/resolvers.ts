import { find, isNil } from 'lodash';
import moment from 'moment';
import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';

import { MultiOrder, Order, OrderItemCount, ShopItem } from '~prisma/models';
import { GraphQLError } from 'graphql';
import { Context } from 'src/commonUtils';
import { shopItemLoader } from 'src/dataloaders';

import { AddToOrderInput, FindMultiOrderByUserIdInput, RemoveFromOrderInput } from '../inputs';

@Resolver(() => MultiOrder)
export class MultiCartResolver {
  @Query(() => MultiOrder)
  async findMultiCartsByUserId(
    @Arg('findMultiOrderByUserIdInput') args: FindMultiOrderByUserIdInput,
    @Ctx() { prisma }: Context,
  ): Promise<Array<MultiOrder>> {
    return await prisma.multiOrder.findMany({
      where: {
        orders: {
          some: {
            ownerId: args.user_id,
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

@Resolver(() => Order)
export default class OrderResolver {
  @Query(() => [Order])
  async findOrdersFromOwnerId(
    @Arg('ownerId') userId: string,
    @Ctx() { prisma }: Context,
  ): Promise<Array<Order>> {
    return await prisma.order.findMany({
      where: {
        ownerId: userId,
      },
      include: {
        orderItemCount: true,
      },
    });
  }

  @Mutation(() => Order, { nullable: true })
  async removeFromOrder(
    @Arg('removeFromOrderInput') removeFromOrderInput: RemoveFromOrderInput,
    @Ctx() { prisma }: Context,
  ): Promise<Order | null> {
    const orderItemCountArr = await prisma.orderItemCount.findMany({
      where: {
        AND: [
          { itemId: removeFromOrderInput.item_id },
          { order: { ownerId: removeFromOrderInput.buyer_id, deletedAt: null } },
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
    } else {
      await prisma.orderItemCount.update({
        where: {
          id: orderItemCount.id,
        },
        data: {
          count: orderItemCount.count - 1,
          price: orderItemCount.price - orderItemCount.shopItem.price,
        },
      });
    }
    const order = await prisma.order.findMany({
      where: {
        owner: {
          id: removeFromOrderInput.buyer_id,
        },
        orderItemCount: {
          itemId: removeFromOrderInput.item_id,
        },
      },
      include: {
        orderItemCount: true,
      },
    });
    return await prisma.order.update({
      where: {
        id: order[0].id,
      },
      data: {
        price: order[0].orderItemCount.price,
      },
    });
  }

  @Mutation(() => [Order])
  async addToOrder(
    @Arg('addToOrderInput') addToCartInput: AddToOrderInput,
    @Ctx() { prisma }: Context,
  ): Promise<Array<Order>> {
    const item = await prisma.shopItem.findOne({
      where: {
        id: addToCartInput.item_id,
      },
    });
    const buyer = await prisma.user.findOne({
      where: {
        id: addToCartInput.buyer_id,
      },
      include: {
        orders: {
          where: {
            deletedAt: null,
          },
          include: {
            orderItemCount: {
              include: {
                shopItem: true,
              },
            },
          },
        },
      },
    });

    const order = find(buyer.orders, (order) => order.orderItemCount.shopItem.id === item.id);

    if (isNil(order)) {
      await prisma.orderItemCount.create({
        data: {
          count: 1,
          price: item.price,
          shopItem: {
            connect: {
              id: item.id,
            },
          },
          order: {
            create: {
              owner: {
                connect: {
                  id: addToCartInput.buyer_id,
                },
              },
              price: item.price,
            },
          },
        },
      });
    } else {
      await prisma.orderItemCount.update({
        where: {
          id: order.orderItemCount.id,
        },
        data: {
          count: order.orderItemCount.count + 1,
          price: order.orderItemCount.price + item.price,
        },
      });
    }
    return await prisma.order.findMany({
      where: {
        ownerId: addToCartInput.buyer_id,
        deletedAt: null,
      },
    });
  }
}
