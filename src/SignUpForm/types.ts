import { Field, ObjectType } from "type-graphql";

@ObjectType({ description: "Object representing a Sign Up Form" })
export default class SignUpForm {
  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  phone?: number;

  @Field()
  q1: string;

  @Field()
  q2: string;

  @Field()
  q3: string;

  @Field()
  q4: string;

  @Field()
  mailing: boolean;

  constructor(
    q1: string,
    q2: string,
    q3: string,
    q4: string,
    mailing: boolean,
    email?: string,
    phone?: number
  ) {
    this.email = email;
    this.phone = phone;
    this.q1 = q1;
    this.q2 = q2;
    this.q3 = q3;
    this.q4 = q4;
    this.mailing = mailing;
  }
}
