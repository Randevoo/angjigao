import { AddToCartInput } from './inputs';
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
  async addToCart(
    @Arg('addToCartInput') orderInput: AddToCartInput,
    @Ctx() context: Context,
    info: GraphQLResolveInfo,
  ) {
    const cartRepo = context.db.getRepository(Cart);
    const orderItemCountRepo = context.db.getRepository(CartItemCount);

    const item = await context.db
      .getRepository(ShoppingItem)
      .findOneOrFail({ id: orderInput.item_id });
    const buyer = await context.db.getRepository(User).findOneOrFail(
      { id: orderInput.buyer_id },
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
      const newItemCount = orderItemCountRepo.create({
        item,
        count: 1,
        price: item.price,
      });

      buyerCart.cartItemCounts = concat(buyerCart.cartItemCounts, newItemCount);
      buyerCart.price = sumBy(buyerCart.cartItemCounts, (itemAndCount) => itemAndCount.price);
    } else {
      cartItemCount.count = cartItemCount.count + 1;
      cartItemCount.price = cartItemCount.price + item.price;
      await orderItemCountRepo.save(cartItemCount);
      buyerCart.price = buyerCart.price + item.price;
    }

    return await cartRepo.save(buyerCart);
  }
}
