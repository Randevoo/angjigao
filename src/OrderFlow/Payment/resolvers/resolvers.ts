import { sumBy } from 'lodash';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';

import { PaymentMultiOrder, PaymentOrder } from '~prisma/models';
import { Context } from 'src/commonUtils';
import { calculatePriceFromOrder } from 'src/OrderFlow/utils';

import { PayMultiOrderInput, PayUnfulfilledOrderInput } from '../inputs';

@Resolver()
export default class PaymentResolver {
  // Unfulfilled order means that the person wants the discount, has paid, but has not found a plus one
  // This also implies that the user is paying for her own order, and the other user has not paid for his/order yet
  @Mutation(() => PaymentOrder)
  async payUnfulfilledOrder(
    @Arg('payUnfulfilledOrderInput') args: PayUnfulfilledOrderInput,
    @Ctx() { stripe, user, prisma }: Context,
  ): Promise<PaymentOrder> {
    const orderToPay = await prisma.order.findOne({
      where: {
        id: args.order_id,
      },
      include: {
        orderItemCount: {
          include: {
            shopItem: true,
          },
        },
      },
    });
    const payee = await prisma.user.findOne({
      where: {
        id: user.uid,
      },
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculatePriceFromOrder(orderToPay),
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
        orderDeliveryStatus: {
          create: {
            Address: {
              connect: {
                id: args.address_id,
              },
            },
            status: 'PREPARING',
          },
        },
      },
    });
  }

  // User has paid the multi order in full.
  @Mutation(() => PaymentMultiOrder)
  async payMultiOrder(
    @Arg('payMultiOrderInput') args: PayMultiOrderInput,
    @Ctx() { stripe, user, prisma }: Context,
  ): Promise<PaymentMultiOrder> {
    const multiOrderToPay = await prisma.multiOrder.findOne({
      where: {
        id: args.multi_order_id,
      },
      include: {
        orders: {
          include: {
            orderItemCount: {
              include: {
                shopItem: true,
              },
            },
          },
        },
      },
    });
    const payee = await prisma.user.findOne({
      where: {
        id: user.uid,
      },
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: sumBy(multiOrderToPay.orders, (order) => calculatePriceFromOrder(order)),
      currency: 'sgd',
      payment_method: args.payment_method_id,
      customer: payee.stripe_cust_id,
      confirm: true,
    });
    return prisma.paymentMultiOrder.create({
      data: {
        paymentIntentId: paymentIntent.id,
        paymentStatus: 'PAID',
        multiOrder: {
          connect: {
            id: args.multi_order_id,
          },
        },
        MultiOrderDeliveryStatus: {
          create: {
            Address: {
              connect: {
                id: args.address_id,
              },
            },
            status: 'PREPARING',
          },
        },
      },
    });
  }
}
