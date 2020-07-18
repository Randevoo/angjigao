import { AddToCartInput } from './inputs';
import { User } from 'src/models/User/models';
import { Context } from './../index';
import { Order } from 'src/models/Order/models';
import { Resolver, Mutation, Ctx, Arg } from 'type-graphql';
import { ShoppingItem } from 'src/models/ShoppingItem/models';
import { Cart } from 'src/models/Cart/Cart';
import { isNil, concat } from 'lodash';

@Resolver(() => Cart)
export default class CartResolver {
  @Mutation(() => Cart)
  async addToCart(@Arg('addToCartInput') orderInput: AddToCartInput, @Ctx() context: Context) {
    const cartRepo = context.db.getRepository(Cart);
    const orderRepo = context.db.getRepository(Order);

    const item = await context.db
      .getRepository(ShoppingItem)
      .findOneOrFail({ id: orderInput.item_id }, { relations: ['shop'] });
    const buyer = await context.db
      .getRepository(User)
      .findOneOrFail({ id: orderInput.buyer_id }, { relations: ['cart'] });

    const buyerCart =
      buyer.cart ||
      cartRepo.create({
        owner: buyer,
        orders: [],
      });

    const order =
      (await orderRepo.findOne({
        where: {
          shop: {
            id: item.shop.id,
          },
        },
      })) ||
      orderRepo.create({
        shop: item.shop,
        buyer: buyer,
        items: [],
      });

    order.items = concat(order.items, item);
    await orderRepo.save(order);
    buyerCart.orders = concat(buyerCart.orders, order);

    return cartRepo.save(buyerCart);
  }
}
