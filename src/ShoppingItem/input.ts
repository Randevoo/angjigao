import { InputType, Field } from 'type-graphql';
import { ShoppingItem } from '../models/ShoppingItem/models';

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
