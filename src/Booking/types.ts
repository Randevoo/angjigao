import { Field, ObjectType, Int } from "type-graphql";
import { GraphQLScalarType } from "graphql";

const TimeframeScalar = new GraphQLScalarType({
  name: "Timeframe",
  description: "Timeframe that contains time start and time end",
  serialize(value: Timeframe) {
    return value;
  },
  parseValue(value: Timeframe) {
    return value;
  }
});

export interface Timeframe {
  time_start: Date;
  time_end: Date;
}

@ObjectType({ description: "Object representing a Trip" })
export class Trip {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  price: number;

  @Field()
  type: string;

  @Field()
  description: string;

  @Field({ nullable: true })
  booking_uuid?: string;

  @Field()
  guide_uuid: string;

  @Field()
  trip_start: Date;

  @Field()
  trip_end: Date;

  @Field(type => [TimeframeScalar])
  unavailable_times: Timeframe[];

  constructor(properties: {
    id: string;
    name: string;
    price: number;
    type: string;
    description: string;
    booking_uuid?: string;
    guide_uuid: string;
    trip_start: Date;
    trip_end: Date;
    unavailable_times: Timeframe[];
  }) {
    this.id = properties.id;
    this.name = properties.name;
    this.price = properties.price;
    this.type = properties.type;
    this.description = properties.description;
    this.booking_uuid = properties.booking_uuid;
    this.guide_uuid = properties.guide_uuid;
    this.trip_start = properties.trip_start;
    this.trip_end = properties.trip_end;
    this.unavailable_times = properties.unavailable_times;
  }
}

@ObjectType({ description: "Object representing a Booking" })
export class Booking {
  @Field()
  id: string;

  @Field()
  booked_by: string;

  @Field()
  trip_uuid: string;

  @Field()
  charge_id: string;

  constructor(
    id: string,
    booked_by: string,
    trip_uuid: string,
    charge_id: string
  ) {
    this.id = id;
    this.booked_by = booked_by;
    this.trip_uuid = trip_uuid;
    this.charge_id = charge_id;
  }
}
