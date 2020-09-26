import Faker from 'faker';

import { PrismaClient } from '@prisma/client';
import { Shop, ShopItem } from '~prisma/models';

interface ShoppingItemFactoryArgs {
  name?: string;
  price?: number;
  description?: string;
  image_url?: string;
  shop: Shop;
  categories?: string[];
}

export async function insertNewShopItem(
  prisma: PrismaClient,
  seedArgs: ShoppingItemFactoryArgs,
): Promise<ShopItem> {
  const { name, price, description, image_url, shop } = seedArgs;
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
