import { Context } from './../index';
import { Ctx } from 'type-graphql';
import { Arg } from 'type-graphql';
import { Mutation } from 'type-graphql';
import { User } from 'src/models/User/models';
import { Resolver, FieldResolver, Root } from 'type-graphql';
import { Order } from 'src/models/Order/models';
import UserInput from './input';

@Resolver(() => User)
export default class UserResolver {
  @FieldResolver(() => Order)
  user(@Root() root: User, @Ctx() context: Context): Promise<Order> {
    return context.orderLoader.load(root.id);
  }
  @Mutation(() => User)
  async createUser(
    @Arg('userInput')
    { username, dob, password }: UserInput,
    @Ctx() context: Context,
  ) {
    let user = new User();
    user.username = username;
    user.dob = dob;
    user.password = password;

    return context.db.getRepository(User).save(user);
  }
}
