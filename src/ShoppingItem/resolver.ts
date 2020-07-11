import { Context } from '../index';
import 'reflect-metadata';
import { Resolver, Arg, Query, Mutation, Ctx } from 'type-graphql';
import { ShoppingItem } from './models';

@Resolver()
export default class BookingResolver {
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

  // @Mutation((returns) => Trip)
  // async createTrip(
  //   @Arg('tripInput')
  //   { name, price, type, description, guide_uuid, trip_start, trip_end, image_url }: TripInput,
  //   @Ctx() context: Context,
  // ) {
  //   const trip_id = uuid_v4();
  //   await context.firebaseDb.ref('trips').child(trip_id).set({
  //     name,
  //     price,
  //     type,
  //     description,
  //     guide_uuid,
  //     trip_start,
  //     trip_end,
  //   });

  //   return new Trip({
  //     id: trip_id,
  //     name,
  //     price,
  //     type,
  //     description,
  //     guide_uuid,
  //     trip_start,
  //     trip_end,
  //     unavailable_times: [] as Timeframe[],
  //     image_url,
  //   });
  // }
}
