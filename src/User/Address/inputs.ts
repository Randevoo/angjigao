import { Field, InputType } from 'type-graphql';
@InputType()
export class AddAddressInput {
  @Field()
  city: string;

  @Field()
  state: string;

  @Field()
  line1: string;

  @Field()
  line2: string;

  @Field()
  postal: string;
}
