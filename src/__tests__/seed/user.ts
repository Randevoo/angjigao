import { PrismaClient } from '@prisma/client';

import Faker from 'faker';

export async function insertNewUser(prisma: PrismaClient) {
  return await prisma.user.create({
    data: {
      username: Faker.internet.userName('test', 'ting'),
      password: Faker.internet.password(),
      dob: Faker.date.past(20),
      stripe_cust_id: Faker.random.uuid(),
      email: Faker.internet.email(),
    },
  });
}

export async function insertNewShop(prisma: PrismaClient) {
  return await prisma.shop.create({
    data: {
      username: Faker.internet.userName('test', 'ting'),
      password: Faker.internet.password(),
      email: Faker.internet.email(),
    },
  });
}
