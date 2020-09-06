import { map, omit } from 'lodash';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';

import { Address } from '~prisma/models';
import { Context } from 'src/commonUtils';
import AddressWithDefault from 'src/User/Address/models/AddressWithDefault';

import { AddAddressInput, DeleteAddressInput } from '../inputs';

@Resolver(() => Address)
export default class AddressResolver {
  @Query(() => [AddressWithDefault])
  async getAddresses(@Ctx() { prisma, user }: Context): Promise<Array<AddressWithDefault>> {
    const addresses = await prisma.address.findMany({
      where: {
        userId: user.uid,
      },
      include: {
        user: true,
      },
    });
    return map(addresses, (address) => ({
      ...omit(address, ['user']),
      default: address.user.defaultAddressId === address.id,
    }));
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
