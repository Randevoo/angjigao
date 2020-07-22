import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { keyBy, map } from 'lodash';

export const shopItemLoader = (client: PrismaClient) =>
  new DataLoader(async (ids) => {
    const items = await client.shopItem.findMany({
      where: {
        id: {
          in: ids as string[],
        },
      },
    });
    const itemsById = keyBy(items, (item) => item.id);
    return map(ids as string[], (id) => itemsById[id]);
  });
