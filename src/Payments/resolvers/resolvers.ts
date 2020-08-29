import { classToPlain, plainToClass } from 'class-transformer';
import { Arg, Ctx, Mutation, Query } from 'type-graphql';

import { Context } from 'src/commonUtils';
import { PaymentMethod } from 'src/Payments/models/PaymentMethod';

import { AddPaymentInfoInput, GetPaymentInfoInput } from '../inputs';

export default class PaymentResolver {
  @Query(() => [PaymentMethod])
  async getPaymentInfo(
    @Arg('getPaymentInfoInput') args: GetPaymentInfoInput,
    @Ctx() { stripe }: Context,
  ): Promise<Array<PaymentMethod>> {
    const paymentMethods = (
      await stripe.paymentMethods.list({
        customer: args.stripe_cust_id,
        type: 'card',
      })
    ).data;
    return paymentMethods.map((paymentMethod) => {
      const json = classToPlain(paymentMethod);
      return plainToClass(PaymentMethod, json);
    });
  }

  @Mutation(() => PaymentMethod)
  async addPaymentInfo(
    @Arg('addPaymentInfoInput') args: AddPaymentInfoInput,
    @Ctx() { stripe }: Context,
  ): Promise<PaymentMethod> {
    const paymentMethod = await stripe.paymentMethods.attach(args.token, {
      customer: args.stripe_cust_id,
    });
    if (args.default) {
      await stripe.customers.update(args.stripe_cust_id, {
        invoice_settings: {
          default_payment_method: paymentMethod.id,
        },
      });
    }

    return plainToClass(PaymentMethod, classToPlain(paymentMethod));
  }
}
