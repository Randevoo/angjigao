import { User, Shop } from 'src/models/User/models';
import { Connection } from 'typeorm';
import Faker from 'faker';

export async function insertNewUser(db: Connection) {
  const newUser = db.getRepository(User).create({
    username: Faker.internet.userName('test', 'ting'),
    password: Faker.internet.password(),
    dob: Faker.date.past(20),
  });
  return await db.getRepository(User).save(newUser);
}

export async function insertNewShop(db: Connection) {
  const shopRepo = db.getRepository(Shop);
  const newShop = shopRepo.create({
    username: Faker.internet.userName('test', 'ting'),
    password: Faker.internet.password(),
    dob: Faker.date.past(20),
  });
  return await db.getRepository(Shop).save(newShop);
}
