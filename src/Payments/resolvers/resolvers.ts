import { PaymentMethod } from 'src/Payments/models/PaymentMethod';
import { Query, Arg, Ctx } from 'type-graphql';
import { Context } from 'src/commonUtils';
import { GetPaymentInfoInput } from '../inputs';
import { plainToClass, classToPlain } from 'class-transformer';

export default class PaymentResolver {
  @Query(() => [PaymentMethod])
  async getPaymentInfo(
    @Arg('getPaymentInfoInput') args: GetPaymentInfoInput,
    @Ctx() { prisma, auth, stripe }: Context,
  ) {
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
}
