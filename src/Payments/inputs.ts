import { Field, InputType } from 'type-graphql';
@InputType()
export class GetPaymentInfoInput {
  @Field()
  stripe_cust_id: string;
}

@InputType()
export class AddPaymentInfoInput {
  @Field()
  stripe_cust_id: string;
  @Field()
  token: string;
  @Field({ nullable: true })
  default?: boolean;
}

@InputType()
export class DeletePaymentInfoInput {
  @Field()
  paymentMethodId: string;
}
