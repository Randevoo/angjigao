import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';

import { Address } from '~prisma/models';
import { Context } from 'src/commonUtils';

import { AddAddressInput } from '../inputs';

@Resolver(() => Address)
export default class AddressResolver {
  @Mutation(() => [Address])
  async addAddress(
    @Arg('addAddressInput') args: AddAddressInput,
    @Ctx() { prisma, user }: Context,
  ): Promise<Array<Address>> {
    await prisma.user.update({
      where: {
        id: user.uid,
      },
      data: {
        addresses: {
          create: {
            ...args,
          },
        },
      },
    });
    return prisma.address.findMany({
      where: {
        userId: user.uid,
      },
    });
  }
}
