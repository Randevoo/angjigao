import { Field, InputType } from 'type-graphql';
@InputType()
export class AddAddressInput {
  @Field()
  country: string;

  @Field()
  city: string;

  @Field()
  state: string;

  @Field()
  line1: string;

  @Field()
  line2: string;

  @Field()
  postal_code: string;

  @Field()
  default: boolean;
}

@InputType()
export class DeleteAddressInput {
  @Field()
  id: string;
}
