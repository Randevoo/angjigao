import { Field, InputType } from 'type-graphql';
@InputType()
export class AddToOrderInput {
  @Field()
  item_id: string;

  @Field()
  buyer_id: string;
}

@InputType()
export class RemoveFromOrderInput {
  @Field()
  item_id: string;

  @Field()
  buyer_id: string;
}

@InputType()
export class FindMultiOrderByUserIdInput {
  @Field()
  user_id: string;
}

@InputType()
export class PayCurrentOrderInput {
  @Field()
  user_id: string;

  @Field()
  order_id: string;

  @Field()
  payment_method_id: string;
}
