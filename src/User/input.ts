import { InputType, Field } from "type-graphql";

@InputType()
export default class UserInput {
  @Field()
  name: string;
}
