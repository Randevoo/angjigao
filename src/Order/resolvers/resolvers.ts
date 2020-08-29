import { find, isNil } from 'lodash';
import moment from 'moment';
import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';

import { CartItemCount, MultiOrder, Order, ShopItem } from '~prisma/models';
import { GraphQLError } from 'graphql';
import { Context } from 'src/commonUtils';
import { shopItemLoader } from 'src/dataloaders';

import { AddToOrderInput, FindMultiOrderByUserIdInput, RemoveFromOrderInput } from '../inputs';

@Resolver(() => MultiOrder)
export class MultiCartResolver {
  @Query(() => MultiOrder)
  async findMultiCartsByUserId(
    @Arg('findMultiCartByUserIdInput') args: FindMultiOrderByUserIdInput,
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

@Resolver(() => CartItemCount)
export class CartItemCountResolver {
  @FieldResolver(() => ShopItem)
  async shopItem(
    @Root() cartItemCount: CartItemCount,
    @Ctx() { prisma }: Context,
  ): Promise<ShopItem> {
    return await shopItemLoader(prisma).load(cartItemCount.itemId);
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
        cartItemCount: true,
      },
    });
  }

  @Mutation(() => Order, { nullable: true })
  async removeFromOrder(
    @Arg('removeFromOrderInput') removeFromOrderInput: RemoveFromOrderInput,
    @Ctx() { prisma }: Context,
  ): Promise<Order | null> {
    const cartItemCountArr = await prisma.cartItemCount.findMany({
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
    if (cartItemCountArr.length === 0) {
      throw new GraphQLError('Item not found in cart');
    }
    const cartItemCount = cartItemCountArr[0];
    if (cartItemCount.count < 2) {
      await prisma.order.update({
        where: {
          id: cartItemCount.orderId,
        },
        data: {
          deletedAt: moment().toDate(),
        },
      });
      return null;
    } else {
      await prisma.cartItemCount.update({
        where: {
          id: cartItemCount.id,
        },
        data: {
          count: cartItemCount.count - 1,
          price: cartItemCount.price - cartItemCount.shopItem.price,
        },
      });
    }
    const order = await prisma.order.findMany({
      where: {
        owner: {
          id: removeFromOrderInput.buyer_id,
        },
        cartItemCount: {
          itemId: removeFromOrderInput.item_id,
        },
      },
      include: {
        cartItemCount: true,
      },
    });
    return await prisma.order.update({
      where: {
        id: order[0].id,
      },
      data: {
        price: order[0].cartItemCount.price,
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
            cartItemCount: {
              include: {
                shopItem: true,
              },
            },
          },
        },
      },
    });

    const order = find(buyer.orders, (order) => order.cartItemCount.shopItem.id === item.id);

    if (isNil(order)) {
      await prisma.cartItemCount.create({
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
      await prisma.cartItemCount.update({
        where: {
          id: order.cartItemCount.id,
        },
        data: {
          count: order.cartItemCount.count + 1,
          price: order.cartItemCount.price + item.price,
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
