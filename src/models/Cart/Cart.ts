import { Order } from 'src/models/Order/models';
import { User } from 'src/models/User/models';
import { Field, ObjectType } from 'type-graphql';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { MultiCart } from './MultiCart';

@Entity()
@ObjectType({ description: 'Object representing a Cart' })
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @JoinColumn()
  @OneToOne((type) => User, (user) => user.cart)
  owner: User;

  @OneToMany((type) => Order, (order) => order.cart)
  @Field((type) => [Order])
  orders: Order[];

  @Column({ nullable: true })
  charge_id: string;

  @JoinColumn()
  @ManyToOne((type) => MultiCart, (multiCart) => multiCart.carts)
  multi_cart: MultiCart;

  totalPrice: number;

  @Column({ default: 0 })
  price: number;
}
