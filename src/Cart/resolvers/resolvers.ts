import { PayCurrentCartInput } from './../inputs';
import { CartItemCount } from '~prisma/models/CartItemCount';
import { Cart } from '~prisma/models/Cart';
import { AddToCartInput, RemoveFromCartInput, FindMultiCartByUserIdInput } from '../inputs';
import { Context } from 'src/commonUtils';
import { Resolver, Mutation, Ctx, Arg, Root, FieldResolver, Query } from 'type-graphql';
import { isNil, find, sumBy } from 'lodash';
import { GraphQLError } from 'graphql';
import { ShopItem } from '~prisma/models/ShopItem';
import { shopItemLoader } from 'src/dataloaders';
import { MultiCart } from '~prisma/models/MultiCart';
import { PaymentStatus } from '~prisma/enums/PaymentStatus';

@Resolver((type) => MultiCart)
export class MultiCartResolver {
  @Query(() => MultiCart)
  async findMultiCartsByUserId(
    @Arg('findMultiCartByUserIdInput') args: FindMultiCartByUserIdInput,
    @Ctx() { prisma }: Context,
  ) {
    return await prisma.multiCart.findMany({
      where: {
        carts: {
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

@Resolver(() => Cart)
export default class CartResolver {
  @Query(() => Cart)
  async findCartFromOwnerId(@Arg('ownerId') userId: string, @Ctx() { prisma }: Context) {
    return (
      await prisma.cart.findMany({
        where: {
          ownerId: userId,
        },
        include: {
          cartItemCounts: true,
        },
      })
    )[0];
  }

  @Mutation(() => Cart)
  async payCurrentCart(
    @Arg('payCurrentCartInput') input: PayCurrentCartInput,
    @Ctx() { prisma, stripe }: Context,
  ) {
    const user = await prisma.user.findOne({
      where: {
        id: input.user_id,
      },
    });
    const cart = await prisma.cart.findOne({
      where: {
        id: input.cart_id,
      },
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: cart.price,
      currency: 'SGD',
      payment_method: input.payment_method_id,
      capture_method: 'manual',
    });

    return await prisma.cart.update({
      where: {
        id: input.cart_id,
      },
      data: {
        paymentIntentId: paymentIntent.id,
        paymentStatus: PaymentStatus.AWAITING_CATURE,
      },
    });
  }

  @Mutation(() => Cart)
  async removeFromCart(
    @Arg('removeFromCartInput') removeFromCartInput: RemoveFromCartInput,
    @Ctx() { prisma }: Context,
  ) {
    const cartItemCountArr = await prisma.cartItemCount.findMany({
      where: {
        AND: [
          { itemId: removeFromCartInput.item_id },
          { cart: { ownerId: removeFromCartInput.buyer_id } },
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
    const cart = await prisma.cart.findMany({
      where: {
        owner: {
          id: removeFromCartInput.buyer_id,
        },
      },
      include: {
        cartItemCounts: true,
      },
    });
    return await prisma.cart.update({
      where: {
        id: cart[0].id,
      },
      data: {
        price: sumBy(cart[0].cartItemCounts, (itemCount) => itemCount.price),
      },
    });
  }

  @Mutation(() => Cart)
  async addToCart(
    @Arg('addToCartInput') addToCartInput: AddToCartInput,
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
        cart: {
          include: {
            cartItemCounts: {
              include: {
                shopItem: true,
              },
            },
          },
        },
      },
    });

    let buyerCart = buyer.cart;
    // Create cart when user is created

    const cartItemCount = find(
      buyerCart.cartItemCounts,
      (cartItemCount) => cartItemCount.shopItem.id === item.id,
    );

    if (isNil(cartItemCount)) {
      await prisma.cartItemCount.create({
        data: {
          count: 1,
          price: item.price,
          shopItem: {
            connect: {
              id: item.id,
            },
          },
          cart: {
            connect: {
              id: buyerCart.id,
            },
          },
        },
      });
    } else {
      await prisma.cartItemCount.update({
        where: {
          id: cartItemCount.id,
        },
        data: {
          count: cartItemCount.count + 1,
          price: cartItemCount.price + item.price,
        },
      });
    }

    return await prisma.cart.update({
      where: {
        id: buyerCart.id,
      },
      data: {
        price: buyerCart.price + item.price,
      },
    });
  }
}
