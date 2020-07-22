import { PrismaClient, Shop } from '@prisma/client';
import Faker from 'faker';
import { ShoppingItem } from 'src/models/ShoppingItem/models';

interface ShoppingItemFactoryArgs {
  name?: string;
  price?: number;
  description?: string;
  image_url?: string;
  shop?: Shop;
  categories?: string[];
}

export async function insertNewShoppingItem(
  prisma: PrismaClient,
  seedArgs: ShoppingItemFactoryArgs,
) {
  const { name, price, description, image_url, shop, categories } = seedArgs;
  return await prisma.shopItem.create({
    data: {
      name: name ?? Faker.commerce.productName(),
      price: price ?? Faker.random.number(),
      description: description ?? Faker.lorem.paragraphs(2),
      imageUrl: image_url ?? Faker.image.imageUrl(),
      shop: {
        connect: {
          id: shop.id,
        },
      },
    },
  });
}
