import { InputType, Field } from 'type-graphql';

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
export class SignInInput {
  @Field()
  email: string;

  @Field()
  password: string;
}
