import { InputType, Field } from 'type-graphql';
@InputType()
export class AddToCartInput {
  @Field()
  item_id: string;

  @Field()
  buyer_id: string;
}

@InputType()
export class RemoveFromCartInput {
  @Field()
  item_id: string;

  @Field()
  buyer_id: string;
}

@InputType()
export class FindMultiCartByUserIdInput {
  @Field()
  user_id: string;
}

@InputType()
export class PayCurrentCartInput {
  @Field()
  user_id: string;

  @Field()
  cart_id: string;

  @Field()
  payment_method_id: string;
}
