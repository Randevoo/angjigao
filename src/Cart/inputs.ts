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
