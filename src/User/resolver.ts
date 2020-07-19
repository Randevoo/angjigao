import { Context } from './../index';
import { Ctx, Query } from 'type-graphql';
import { Arg } from 'type-graphql';
import { Mutation } from 'type-graphql';
import { User, Shop } from 'src/models/User/models';
import { Resolver, FieldResolver, Root } from 'type-graphql';
import { UserInput, ShopInput } from './input';

@Resolver()
export class ShopResolver {
  @Mutation(() => Shop)
  async createShop(@Arg('shopInput') shopInput: ShopInput, @Ctx() context: Context) {
    let shop = new Shop();
    const { username, password, dob } = shopInput;
    shop.username = username;
    shop.password = password;
    shop.dob = dob;
    return context.db.getRepository(Shop).save(shop);
  }
}

@Resolver(() => User)
export class UserResolver {
  @Query(() => User)
  async getUser(@Arg('userId') id: string, @Ctx() context: Context) {
    return await context.db.getRepository(User).findOneOrFail({ id });
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
