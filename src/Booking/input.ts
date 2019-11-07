import { InputType, Field } from "type-graphql";
import { Booking, Trip } from "./types";

@InputType()
export class BookingInput implements Partial<Booking> {
  @Field()
  id: string;

  @Field()
  booked_by: string;

  @Field()
  trip_uuid: string;

  @Field()
  charge_id: string;
}

@InputType()
export class TripInput implements Partial<Trip> {
  @Field()
  name: string;

  @Field()
  price: number;

  @Field()
  type: string;

  @Field()
  description: string;

  @Field()
  guide_uuid: string;

  @Field()
  trip_start: Date;

  @Field()
  trip_end: Date;
}
