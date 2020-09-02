import { Field, InputType } from 'type-graphql';

@InputType()
export class SignUpInput {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  displayName: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  dob: Date;
}

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
