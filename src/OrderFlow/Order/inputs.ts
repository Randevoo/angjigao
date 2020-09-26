import { Field, InputType } from 'type-graphql';
@InputType()
export class AddToOrderInput {
  @Field()
  item_id: string;

  @Field({ nullable: true })
  order_id?: string;
}

@InputType()
export class RemoveFromOrderInput {
  @Field()
  item_id: string;

  @Field()
  order_id: string;
}
