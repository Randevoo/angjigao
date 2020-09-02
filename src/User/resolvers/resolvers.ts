import { ApolloError } from 'apollo-server';
import Stripe from 'stripe';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';

import { User } from '~prisma/models/User';
import { hashSync } from 'bcrypt';
import { Context } from 'src/commonUtils';

import { AddAddressInput, SignUpInput } from './../inputs';

@Resolver(() => User)
export default class UserResolver {
  @Query(() => User)
  async findUserById(@Arg('id') id: string, @Ctx() { prisma }: Context): Promise<User> {
    return await prisma.user.findOne({
      where: {
        id,
      },
    });
  }
  @Mutation(() => User)
  async signUp(
    @Arg('signUpInput') args: SignUpInput,
    @Ctx() { prisma, auth, stripe }: Context,
  ): Promise<User> {
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

  @Mutation(() => User)
  async addAddress(
    @Arg('addAddressInput') args: AddAddressInput,
    @Ctx() { prisma, user }: Context,
  ): Promise<User> {
    return await prisma.user.update({
      where: {
        id: user.uid,
      },
      data: {
        address: {
          create: {
            ...args,
          },
        },
      },
    });
  }
}
