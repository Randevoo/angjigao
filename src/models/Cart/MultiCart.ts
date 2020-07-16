import { ObjectType, Field } from 'type-graphql';
import { Entity, PrimaryGeneratedColumn, JoinColumn, OneToMany, Column } from 'typeorm';
import { Cart } from './Cart';

@Entity()
@ObjectType({ description: 'Object representing MultiCart' })
export class MultiCart {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @JoinColumn()
  @OneToMany((type) => Cart, (cart) => cart.multi_cart)
  @Field((type) => [Cart])
  carts: Cart[];

  @Column()
  charge_id: string;
}
