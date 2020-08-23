import { InputType, Field } from 'type-graphql';
@InputType()
export class GetPaymentInfoInput {
  @Field()
  stripe_cust_id: string;
}
