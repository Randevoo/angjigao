import { Context } from '../index';
import 'reflect-metadata';
import { Resolver, Arg, Query, Mutation, Ctx } from 'type-graphql';
import { ShoppingItem } from '../models/ShoppingItem/models';
import { ShoppingItemInput } from './input';

@Resolver()
export default class ShoppingItemResolver {
  @Query((returns) => ShoppingItem)
  async getItem(
    @Arg('itemId') itemId: string,
    @Ctx() context: Context,
  ): Promise<ShoppingItem | undefined> {
    return context.db.getRepository(ShoppingItem).findOne(itemId);
  }

  @Query((returns) => [ShoppingItem])
  async getAllItems(@Ctx() context: Context): Promise<ShoppingItem[]> {
    return context.db.getRepository(ShoppingItem).find();
  }

  @Mutation((returns) => ShoppingItem)
  async createItem(
    @Arg('shoppingItemInput')
    { name, price, description, categories, image_url }: ShoppingItemInput,
    @Ctx() context: Context,
  ) {
    let shoppingItem = new ShoppingItem();
    shoppingItem.categories = categories;
    shoppingItem.name = name;
    shoppingItem.price = price;
    shoppingItem.description = description;
    shoppingItem.image_url = image_url;
    return context.db.getRepository(ShoppingItem).save(shoppingItem);
  }
}
