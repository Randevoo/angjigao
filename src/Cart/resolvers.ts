import { AddToCartInput, RemoveFromCartInput } from './inputs';
import { User } from 'src/models/User/models';
import { Context } from './../index';
import { Resolver, Mutation, Ctx, Arg, Root, FieldResolver } from 'type-graphql';
import { ShoppingItem } from 'src/models/ShoppingItem/models';
import { Cart, CartItemCount } from 'src/models/Cart/Cart';
import { isNil, concat, find, sumBy } from 'lodash';
import { GraphQLResolveInfo } from 'graphql';

@Resolver(() => Cart)
export default class CartResolver {
  @Mutation(() => Cart)
  async removeFromCart(
    @Arg('removeFromCartInput') removeFromCartInput: RemoveFromCartInput,
    @Ctx() context: Context,
  ) {
    const cartItemCountRepo = context.db.getRepository(CartItemCount);
    const cartRepo = context.db.getRepository(Cart);
    const cartItemCount = await cartItemCountRepo.findOneOrFail({
      relations: ['item'],
      where: {
        item: {
          id: removeFromCartInput.item_id,
        },
        cart: {
          owner: {
            id: removeFromCartInput.buyer_id,
          },
        },
      },
    });
    if (cartItemCount.count > 1) {
      await cartItemCountRepo.softRemove(cartItemCount);
    } else {
      cartItemCount.price -= cartItemCount.item.price;
      cartItemCount.count -= 1;
      await cartItemCountRepo.save(cartItemCount);
    }
    const cart = await cartRepo.findOne({
      relations: ['cartItemCounts', 'cartItemCounts.item'],
      where: {
        owner: {
          id: removeFromCartInput.buyer_id,
        },
      },
    });
    cart.price = sumBy(cart.cartItemCounts, (itemCount) => itemCount.price);
    return await cartRepo.save(cart);
  }

  @Mutation(() => Cart)
  async addToCart(@Arg('addToCartInput') addToCartInput: AddToCartInput, @Ctx() context: Context) {
    const cartRepo = context.db.getRepository(Cart);
    const cartItemCountRepo = context.db.getRepository(CartItemCount);

    const item = await context.db
      .getRepository(ShoppingItem)
      .findOneOrFail({ id: addToCartInput.item_id });
    const buyer = await context.db.getRepository(User).findOneOrFail(
      { id: addToCartInput.buyer_id },
      {
        relations: ['cart', 'cart.cartItemCounts', 'cart.cartItemCounts.item'],
      },
    );

    let buyerCart = buyer.cart;

    if (isNil(buyerCart)) {
      const newCart = cartRepo.create({
        owner: buyer,
        cartItemCounts: [],
      });
      buyerCart = await cartRepo.save(newCart);
    }

    const cartItemCount = find(
      buyerCart.cartItemCounts,
      (cartItemCount) => cartItemCount.item.id === item.id,
    );

    if (isNil(cartItemCount)) {
      const newItemCount = cartItemCountRepo.create({
        item,
        count: 1,
        price: item.price,
      });

      buyerCart.cartItemCounts = concat(buyerCart.cartItemCounts, newItemCount);
      buyerCart.price = sumBy(buyerCart.cartItemCounts, (itemAndCount) => itemAndCount.price);
    } else {
      cartItemCount.count = cartItemCount.count + 1;
      cartItemCount.price = cartItemCount.price + item.price;
      await cartItemCountRepo.save(cartItemCount);
      buyerCart.price = buyerCart.price + item.price;
    }

    return await cartRepo.save(buyerCart);
  }
}
