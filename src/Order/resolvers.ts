import { User, Shop } from 'src/models/User/models';
import { Context } from './../index';
import { Order } from 'src/models/Order/models';
import { Resolver, Mutation, Ctx, Arg } from 'type-graphql';
import { OrderInput } from './inputs';
import { ShoppingItem } from 'src/models/ShoppingItem/models';

@Resolver(() => Order)
export default class OrderResolver {
  @Mutation(() => Order)
  async createOrder(@Arg('orderInput') orderInput: OrderInput, @Ctx() context: Context) {
    const user = await context.db.getRepository(User).findOneOrFail({ id: orderInput.buyer_id });
    const shop = await context.db.getRepository(Shop).findOneOrFail({ id: orderInput.seller_id });
    const item = await context.db
      .getRepository(ShoppingItem)
      .findOneOrFail({ id: orderInput.item_id });
    const order = new Order();
    order.buyer = user;
    order.shop = shop;
    order.items = [item];
    return context.db.manager.save(order);
  }
}
