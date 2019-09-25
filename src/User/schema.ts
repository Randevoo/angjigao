import { Field, ObjectType } from "type-graphql";

@ObjectType({ description: "Object representing User" })
export default class User {
  @Field()
  name: string;

  @Field()
  number: number;

  constructor(name: string) {
    this.name = name;
    this.number = 3;
  }
}
