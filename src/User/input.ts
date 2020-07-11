import { User } from 'src/models/User/models';
import { InputType, Field } from 'type-graphql';

@InputType()
export default class UserInput implements Partial<User> {
  @Field()
  id: string;

  @Field()
  username: string;

  @Field()
  dob: Date;

  @Field()
  password: string;
}
