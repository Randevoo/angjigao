import { Field, ObjectType } from 'type-graphql';

import { Order } from '~prisma/models';

@ObjectType()
export class OrderWithPrice extends Order {
  @Field()
  price: number;
}
