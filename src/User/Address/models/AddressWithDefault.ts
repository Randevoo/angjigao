import { Field, ObjectType } from 'type-graphql';

import { Address } from '~prisma/models';

@ObjectType()
export default class AddressWithDefault extends Address {
  @Field()
  default: boolean;
}
