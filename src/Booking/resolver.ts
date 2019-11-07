import uuid_v4 from "uuid/v4";
import { Context } from "./../index";
import "reflect-metadata";
import { Resolver, Arg, Query, Mutation, Ctx } from "type-graphql";
import { Trip, Timeframe } from "./types";
import { BookingInput, TripInput } from "./input";

@Resolver()
export default class BookingResolver {
  @Query(returns => Trip)
  async getTrip(
    @Arg("tripUuid") tripUuid: string,
    @Ctx() context: Context
  ): Promise<Trip> {
    const {
      id,
      name,
      price,
      type,
      description,
      booking_uuid,
      guide_uuid,
      trip_start,
      trip_end,
      unavailable_times
    } = await context.firebaseDb
      .ref("trips")
      .child(tripUuid)
      .once("value")
      .then(snapshot => snapshot.val());

    return new Trip({
      id,
      name,
      price,
      type,
      description,
      booking_uuid,
      guide_uuid,
      trip_start,
      trip_end,
      unavailable_times
    });
  }

  @Mutation(returns => Trip)
  async bookTrip(
    @Arg("formInput")
    { booked_by, trip_uuid, charge_id }: BookingInput,
    @Ctx() context: Context
  ): Promise<Trip> {
    await context.firebaseDb
      .ref("booking")
      .child(uuid_v4())
      .push({
        trip_uuid: trip_uuid,
        booked_by: booked_by,
        charge_id: charge_id
      });

    const {
      id,
      name,
      price,
      type,
      description,
      booking_uuid,
      guide_uuid,
      trip_start,
      trip_end,
      unavailable_times
    } = await context.firebaseDb
      .ref("trips")
      .child(trip_uuid)
      .once("value")
      .then(snapshot => snapshot.val());

    return new Trip({
      id,
      name,
      price,
      type,
      description,
      booking_uuid,
      guide_uuid,
      trip_start,
      trip_end,
      unavailable_times
    });
  }

  @Mutation(returns => Trip)
  async createTrip(
    @Arg("tripInput")
    {
      name,
      price,
      type,
      description,
      guide_uuid,
      trip_start,
      trip_end
    }: TripInput,
    @Ctx() context: Context
  ) {
    const trip_id = uuid_v4();
    await context.firebaseDb
      .ref("trips")
      .child(trip_id)
      .push({
        name,
        price,
        type,
        description,
        guide_uuid,
        trip_start,
        trip_end
      });

    return new Trip({
      id: trip_id,
      name,
      price,
      type,
      description,
      guide_uuid,
      trip_start,
      trip_end,
      unavailable_times: [] as Timeframe[]
    });
  }
}
