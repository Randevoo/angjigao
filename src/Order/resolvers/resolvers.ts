import { Order } from '~prisma/models/Order';
import { MultiOrder } from '~prisma/models/MultiOrder';
import { CartItemCount } from '~prisma/models/CartItemCount';

import {
  AddToOrderInput,
  RemoveFromOrderInput,
  FindMultiOrderByUserIdInput,
  PayCurrentOrderInput,
} from '../inputs';
import { Context } from 'src/commonUtils';
import { Resolver, Mutation, Ctx, Arg, Root, FieldResolver, Query } from 'type-graphql';
import { isNil, find } from 'lodash';
import { GraphQLError } from 'graphql';
import { ShopItem } from '~prisma/models/ShopItem';
import { shopItemLoader } from 'src/dataloaders';

@Resolver((type) => MultiOrder)
export class MultiCartResolver {
  @Query(() => MultiOrder)
  async findMultiCartsByUserId(
    @Arg('findMultiCartByUserIdInput') args: FindMultiOrderByUserIdInput,
    @Ctx() { prisma }: Context,
  ) {
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

@Resolver((type) => CartItemCount)
export class CartItemCountResolver {
  @FieldResolver(() => ShopItem)
  async shopItem(@Root() cartItemCount: CartItemCount, @Ctx() { prisma }: Context) {
    return await shopItemLoader(prisma).load(cartItemCount.itemId);
  }
}

@Resolver(() => Order)
export default class OrderResolver {
  @Query(() => [Order])
  async findOrdersFromOwnerId(@Arg('ownerId') userId: string, @Ctx() { prisma }: Context) {
    return await prisma.order.findMany({
      where: {
        ownerId: userId,
      },
      include: {
        cartItemCount: true,
      },
    });
  }

  @Mutation(() => Order)
  async payCurrentOrder(
    @Arg('payCurrentOrderInput') input: PayCurrentOrderInput,
    @Ctx() { prisma, stripe }: Context,
  ) {
    const user = await prisma.user.findOne({
      where: {
        id: input.user_id,
      },
    });
    const cart = await prisma.order.findOne({
      where: {
        id: input.order_id,
      },
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: cart.price,
      currency: 'SGD',
      payment_method: input.payment_method_id,
      capture_method: 'manual',
    });

    return await prisma.order.update({
      where: {
        id: input.order_id,
      },
      data: {
        paymentIntentId: paymentIntent.id,
      },
    });
  }

  @Mutation(() => Order)
  async removeFromOrder(
    @Arg('removeFromOrderInput') removeFromOrderInput: RemoveFromOrderInput,
    @Ctx() { prisma }: Context,
  ) {
    const cartItemCountArr = await prisma.cartItemCount.findMany({
      where: {
        AND: [
          { itemId: removeFromOrderInput.item_id },
          { order: { ownerId: removeFromOrderInput.buyer_id } },
        ],
      },
      include: {
        shopItem: true,
      },
    });
    if (cartItemCountArr.length === 0) {
      throw new GraphQLError('Item not found in cart');
    }
    const cartItemCount = cartItemCountArr[0];
    if (cartItemCount.count < 2) {
      await prisma.cartItemCount.delete({
        where: {
          id: cartItemCount.id,
        },
      });
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
    const cart = await prisma.order.findMany({
      where: {
        owner: {
          id: removeFromOrderInput.buyer_id,
        },
      },
      include: {
        cartItemCount: true,
      },
    });
    return await prisma.order.update({
      where: {
        id: cart[0].id,
      },
      data: {
        price: cart[0].cartItemCount.price,
      },
    });
  }

  @Mutation(() => [Order])
  async addToOrder(
    @Arg('addToOrderInput') addToCartInput: AddToOrderInput,
    @Ctx() { prisma }: Context,
  ) {
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
      },
    });
  }
}
