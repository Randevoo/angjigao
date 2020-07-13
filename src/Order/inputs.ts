import { Order } from 'src/models/Order/models';
import { InputType, Field } from 'type-graphql';
@InputType()
export class OrderInput implements Partial<Order> {
  @Field()
  item_id: string;

  @Field()
  buyer_id: string;

  @Field()
  seller_id: string;

  @Field()
  charge_id: string;
}
