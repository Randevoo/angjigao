import { Shop } from 'src/models/User/models';
import Faker from 'faker';
import { ShoppingItem } from 'src/models/ShoppingItem/models';
import { Connection } from 'typeorm';

interface ShoppingItemFactoryArgs {
  name?: string;
  price?: number;
  description?: string;
  image_url?: string;
  shop?: Shop;
  categories?: string[];
}

export async function insertNewShoppingItem(db: Connection, seedArgs: ShoppingItemFactoryArgs) {
  const itemRepo = db.getRepository(ShoppingItem);
  const { name, price, description, image_url, shop, categories } = seedArgs;
  const newItem = itemRepo.create({
    name: name ?? Faker.commerce.productName(),
    price: price ?? Faker.random.number(),
    description: description ?? Faker.lorem.paragraphs(2),
    image_url: image_url ?? Faker.image.imageUrl(),
    categories: categories ?? [],
    shop,
  });
  return await itemRepo.save(newItem);
}
