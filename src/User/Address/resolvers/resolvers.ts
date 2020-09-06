import { omit } from 'lodash';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';

import { Address } from '~prisma/models';
import { Context } from 'src/commonUtils';

import { AddAddressInput, DeleteAddressInput } from '../inputs';

@Resolver(() => Address)
export default class AddressResolver {
  @Query(() => [Address])
  async getAddresses(@Ctx() { prisma, user }: Context): Promise<Array<Address>> {
    return prisma.address.findMany({
      where: {
        userId: user.uid,
      },
    });
  }

  @Mutation(() => [Address])
  async addAddress(
    @Arg('addAddressInput') args: AddAddressInput,
    @Ctx() { prisma, user }: Context,
  ): Promise<Array<Address>> {
    const address = await prisma.address.create({
      data: {
        ...omit(args, 'default'),
        user: {
          connect: {
            id: user.uid,
          },
        },
      },
    });
    if (args.default) {
      await prisma.user.update({
        where: {
          id: user.uid,
        },
        data: {
          defaultAddressId: address.id,
        },
      });
    }
    return prisma.address.findMany({
      where: {
        userId: user.uid,
      },
    });
  }

  @Mutation(() => Address)
  async removeAddress(
    @Arg('addAddressInput') args: DeleteAddressInput,
    @Ctx() { prisma }: Context,
  ): Promise<Address> {
    return prisma.address.delete({
      where: {
        id: args.id,
      },
    });
  }
}
