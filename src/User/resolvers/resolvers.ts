import { Context } from 'src/index';
import { SignUpInput, SignInInput } from './../inputs';
import { Resolver, Mutation, Ctx, Arg, Query } from 'type-graphql';
import { User } from '~prisma/models/User';
import { ApolloError } from 'apollo-server';

@Resolver((type) => User)
export default class UserResolver {
  @Mutation(() => User)
  async signUp(@Arg('signUpInput') args: SignUpInput, @Ctx() { prisma, auth }: Context) {
    const { email, password, displayName, dob } = args;
    let userId, hashedPassword;
    try {
      const { uid, passwordHash } = await auth.createUser({
        email,
        password,
        displayName,
      });
      userId = uid;
      hashedPassword = passwordHash;
    } catch (e) {
      throw new ApolloError(e.message);
    }
    return prisma.user.create({
      data: {
        id: userId,
        email,
        password: hashedPassword,
        username: displayName,
        dob,
        cart: {
          create: {
            cartItemCounts: {
              create: [],
            },
          },
        },
      },
    });
  }
}
