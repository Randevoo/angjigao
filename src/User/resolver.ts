import UserType from "./schema";
import UserInput from "./input";
import { Resolver, ResolverInterface, Arg, Query } from "type-graphql";

let testUser = new UserType("test");

@Resolver(of => UserType)
export default class UserResolver implements ResolverInterface<UserType> {
  @Query(returns => UserType)
  user(@Arg("name") name: string): UserType {
    return testUser;
  }
}
