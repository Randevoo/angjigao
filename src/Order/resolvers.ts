import { Context } from './../index';
import { Order } from 'src/models/Order/models';
import { Resolver, Mutation, Ctx, Arg } from 'type-graphql';
import { OrderInput } from './inputs';

@Resolver(() => Order)
export default class OrderResolver {
  @Mutation()
  createOrder(@Arg('orderInput') orderInput: OrderInput, @Ctx() context: Context) {
    //   const order = new Order()
    //   order.buyer_id
    // context.db.
  }
}
