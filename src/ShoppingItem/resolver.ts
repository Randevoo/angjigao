import { Context } from '../index';
import 'reflect-metadata';
import { Resolver, Arg, Query, Mutation, Ctx } from 'type-graphql';
import { ShoppingItem } from './models';
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

  // @Mutation((returns) => Trip)
  // async bookTrip(
  //   @Arg('bookingInput')
  //   { booked_by, trip_uuid, charge_id }: BookingInput,
  //   @Ctx() context: Context,
  // ): Promise<Trip> {
  //   await context.firebaseDb.ref('booking').child(uuid_v4()).set({
  //     trip_uuid: trip_uuid,
  //     booked_by: booked_by,
  //     charge_id: charge_id,
  //   });

  //   const {
  //     id,
  //     name,
  //     price,
  //     type,
  //     description,
  //     booking_uuid,
  //     guide_uuid,
  //     trip_start,
  //     trip_end,
  //     unavailable_times,
  //     image_url,
  //   } = await context.firebaseDb
  //     .ref('trips')
  //     .child(trip_uuid)
  //     .once('value')
  //     .then((snapshot) => snapshot.val());

  //   return new Trip({
  //     id,
  //     name,
  //     price,
  //     type,
  //     description,
  //     booking_uuid,
  //     guide_uuid,
  //     trip_start,
  //     trip_end,
  //     unavailable_times,
  //     image_url,
  //   });
  // }

  @Mutation((returns) => ShoppingItem)
  async createItem(
    @Arg('tripInput')
    { name, price, description, categories, image_url }: ShoppingItemInput,
    @Ctx() context: Context,
  ) {
    let shoppingItem = new ShoppingItem();
    shoppingItem.categories = categories;
    shoppingItem.name = name;
    shoppingItem.price = price;
    shoppingItem.description = description;
    shoppingItem.image_url = image_url;
    return context.db.getRepository(ShoppingItem).create(shoppingItem);
  }
}
