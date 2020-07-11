import { InputType, Field } from 'type-graphql';
import { ShoppingItem } from '../models/ShoppingItem/models';

// @InputType()
// export class BookingInput implements Partial<Booking> {
//   @Field()
//   id: string;

//   @Field()
//   booked_by: string;

//   @Field()
//   trip_uuid: string;

//   @Field()
//   charge_id: string;
// }

@InputType()
export class ShoppingItemInput implements Partial<ShoppingItem> {
  @Field()
  name: string;

  @Field()
  price: number;

  @Field()
  description: string;

  @Field((type) => [String])
  categories: string[];

  @Field()
  image_url: string;
}
