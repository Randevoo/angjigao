import { Field, InputType } from 'type-graphql';
@InputType()
export class PayUnfulfilledOrderInput {
  @Field()
  order_id: string;

  @Field()
  payment_method_id: string;
}
