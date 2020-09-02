import Faker from 'faker';

import { PrismaClient } from '@prisma/client';
import { Shop, User } from '~prisma/models';

export async function insertNewUser(
  prisma: PrismaClient,
  stripe_cust_id: string = Faker.random.uuid(),
): Promise<User> {
  return await prisma.user.create({
    data: {
      username: Faker.internet.userName('test', 'ting'),
      password: Faker.internet.password(),
      dob: Faker.date.past(20),
      stripe_cust_id,
      email: Faker.internet.email(),
    },
  });
}

export async function insertNewShop(prisma: PrismaClient): Promise<Shop> {
  return await prisma.shop.create({
    data: {
      username: Faker.internet.userName('test', 'ting'),
      password: Faker.internet.password(),
      email: Faker.internet.email(),
    },
  });
}
