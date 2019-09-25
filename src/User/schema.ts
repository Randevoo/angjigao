import { Field, ObjectType } from "type-graphql";

@ObjectType({ description: "Object representing User" })
export default class User {
  @Field()
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}
