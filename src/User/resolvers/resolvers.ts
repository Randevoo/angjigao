import { Context } from 'src/commonUtils';
import { SignUpInput } from './../inputs';
import { Resolver, Mutation, Ctx, Arg, Query } from 'type-graphql';
import { User } from '~prisma/models/User';
import { ApolloError } from 'apollo-server';
import { hashSync } from 'bcrypt';
import Stripe from 'stripe';

@Resolver((type) => User)
export default class UserResolver {
  @Query(() => User)
  async findUserById(@Arg('id') id: string, @Ctx() { prisma }: Context) {
    return await prisma.user.findOne({
      where: {
        id,
      },
    });
  }
  @Mutation(() => User)
  async signUp(@Arg('signUpInput') args: SignUpInput, @Ctx() { prisma, auth, stripe }: Context) {
    const { email, password, displayName, firstName, lastName, dob } = args;
    let userId;
    try {
      const { uid } = await auth.createUser({
        email,
        password,
        displayName,
      });
      userId = uid;
    } catch (e) {
      throw new ApolloError(e.message);
    }
    let cust: Stripe.Customer;
    try {
      cust = await stripe.customers.create({
        email,
        name: `${firstName} ${lastName}`,
      });
    } catch (e) {
      throw new ApolloError(e.message);
    }
    const hashedPassword = hashSync(password, 10);
    return await prisma.user.create({
      data: {
        id: userId,
        email,
        password: hashedPassword,
        username: displayName,
        dob,
        stripe_cust_id: cust.id,
      },
    });
  }
}
