import { InputType, Field } from "type-graphql";
import SignUpForm from "./types";

@InputType()
export default class FormInput implements Partial<SignUpForm> {
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
}
