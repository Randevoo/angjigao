import Faker from 'faker';

import { PrismaClient } from '@prisma/client';
import { Address } from '~prisma/models';
export async function insertNewAddress(
  prisma: PrismaClient,
  userID: string,
  isDefault = false,
): Promise<Address> {
  const addr = await prisma.address.create({
    data: {
      city: Faker.address.city(),
      country: Faker.address.country(),
      line1: Faker.address.streetAddress(),
      line2: Faker.address.streetName(),
      state: Faker.address.state(),
      postal_code: Faker.address.zipCode(),
      user: {
        connect: {
          id: userID,
        },
      },
    },
  });
  if (isDefault) {
    await prisma.user.update({
      where: {
        id: userID,
      },
      data: {
        defaultAddressId: addr.id,
      },
    });
  }
  return addr;
}
