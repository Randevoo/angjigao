import { CartItemCount } from '~prisma/models/CartItemCount';
import { Cart } from '~prisma/models/Cart';
import { AddToCartInput, RemoveFromCartInput } from './inputs';
import { Context } from 'src/index';
import { Resolver, Mutation, Ctx, Arg, Root, FieldResolver } from 'type-graphql';
import { isNil, find, sumBy } from 'lodash';
import { GraphQLError } from 'graphql';
import { ShopItem } from '~prisma/models/ShopItem';
import { shopItemLoader } from 'src/dataloaders';
import moment from 'moment';

@Resolver((type) => CartItemCount)
export class CartItemCountResolver {
  @FieldResolver(() => ShopItem)
  async shopItem(@Root() cartItemCount: CartItemCount, @Ctx() { prisma }: Context) {
    return await shopItemLoader(prisma).load(cartItemCount.itemId);
  }
}

@Resolver(() => Cart)
export default class CartResolver {
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
