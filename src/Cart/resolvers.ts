import { AddToCartInput } from './inputs';
import { User } from 'src/models/User/models';
import { Context } from './../index';
import { Order, OrderItemCount } from 'src/models/Order/models';
import { Resolver, Mutation, Ctx, Arg, Root, FieldResolver } from 'type-graphql';
import { ShoppingItem } from 'src/models/ShoppingItem/models';
import { Cart } from 'src/models/Cart/Cart';
import { isNil, concat, find } from 'lodash';
import { GraphQLResolveInfo } from 'graphql';

@Resolver(() => Cart)
export default class CartResolver {
  @FieldResolver((type) => Order)
  async orders(@Root() root: Cart, @Ctx() context: Context) {
    return context.loader.loadEntity(Order, 'order').where('order.id = :id', { id: root.id });
  }

  @Mutation(() => Cart)
  async addToCart(
    @Arg('addToCartInput') orderInput: AddToCartInput,
    @Ctx() context: Context,
    info: GraphQLResolveInfo,
  ) {
    const cartRepo = context.db.getRepository(Cart);
    const orderRepo = context.db.getRepository(Order);
    const orderItemCountRepo = context.db.getRepository(OrderItemCount);

    const item = await context.db
      .getRepository(ShoppingItem)
      .findOneOrFail({ id: orderInput.item_id }, { relations: ['shop'] });
    const buyer = await context.db.getRepository(User).findOneOrFail(
      { id: orderInput.buyer_id },
      {
        relations: [
          'cart',
          'cart.orders',
          'cart.orders.shop',
          'cart.orders.itemAndCounts',
          'cart.orders.itemAndCounts.item',
        ],
      },
    );

    let buyerCart = buyer.cart;

    if (isNil(buyerCart)) {
      const newCart = cartRepo.create({
        owner: buyer,
        orders: [],
      });
      buyerCart = await cartRepo.save(newCart);
    }

    const order =
      find(buyerCart.orders, (order) => order.shop.id === item.shop.id) ||
      orderRepo.create({
        shop: item.shop,
        buyer: buyer,
        itemAndCounts: [],
      });
    const itemAndCount = find(
      order.itemAndCounts,
      (itemAndCount) => itemAndCount.item.id === item.id,
    );

    if (isNil(itemAndCount)) {
      const newItemCount = orderItemCountRepo.create({
        item,
        count: 1,
        order,
      });

      order.itemAndCounts = concat(order.itemAndCounts, newItemCount);
      await orderRepo.save(order);
    } else {
      itemAndCount.count = itemAndCount.count + 1;
      await orderItemCountRepo.save(itemAndCount);
    }

    await buyerCart.reload();
    return buyerCart;
  }
}
