import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';

import { PaymentOrder } from '~prisma/models';
import { Context } from 'src/commonUtils';

import { PayUnfulfilledOrderInput } from '../inputs';

@Resolver()
export default class PaymentResolver {
  @Mutation(() => PaymentOrder)
  async payOrder(
    @Arg('payOrderInputInput') args: PayUnfulfilledOrderInput,
    @Ctx() { stripe, user, prisma }: Context,
  ): Promise<PaymentOrder> {
    const orderToPay = await prisma.order.findOne({
      where: {
        id: args.order_id,
      },
    });
    const payee = await prisma.user.findOne({
      where: {
        id: user.uid,
      },
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: orderToPay.price,
      currency: 'sgd',
      payment_method: args.payment_method_id,
      customer: payee.stripe_cust_id,
    });

    return await prisma.paymentOrder.create({
      data: {
        paymentIntentId: paymentIntent.id,
        paymentStatus: 'AWAITING_CATURE',
        order: {
          connect: {
            id: args.order_id,
          },
        },
      },
    });
  }
}
