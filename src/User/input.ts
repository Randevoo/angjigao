import { User, Shop } from 'src/models/User/models';
import { InputType, Field } from 'type-graphql';

@InputType()
export class UserInput implements Partial<User> {
  @Field()
  username: string;

  @Field()
  dob: Date;

  @Field()
  password: string;
}

@InputType()
export class ShopInput implements Partial<Shop> {
  @Field()
  username: string;

  @Field()
  dob: Date;

  @Field()
  password: string;
}
