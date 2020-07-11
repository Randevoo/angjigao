import { Context } from './../index';
import { Ctx } from 'type-graphql';
import { Arg } from 'type-graphql';
import { Mutation } from 'type-graphql';
import { User } from 'src/models/User/models';
import { Resolver, FieldResolver, Root } from 'type-graphql';
import { Order } from 'src/models/ShoppingItem/models';
import { RequestContainer } from 'src';
import { UserDataLoader } from 'src/ShoppingItem/dataloader';
import UserInput from './input';

@Resolver()
export default class UserResolver {
  @FieldResolver(() => Order)
  user(@Root() root: Order, @RequestContainer() userDataLoader: UserDataLoader): Promise<User> {
    return userDataLoader.load(root.buyer_id);
  }

  @Mutation(() => User)
  async createItem(
    @Arg('shoppingItemInput')
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
