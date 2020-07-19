import { ShoppingItem } from 'src/models/ShoppingItem/models';
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

  @OneToMany((type) => CartItemCount, (cartItemCount) => cartItemCount.cart, { cascade: true })
  @Field((type) => [CartItemCount])
  cartItemCounts: CartItemCount[];

  @Column({ nullable: true })
  charge_id: string;

  @JoinColumn()
  @ManyToOne((type) => MultiCart, (multiCart) => multiCart.carts)
  multi_cart: MultiCart;

  @Column({ default: 0 })
  @Field()
  price: number;
}

@ObjectType({ description: 'Join table for shopping items and its count in a cart' })
@Entity()
export class CartItemCount {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @ManyToOne((type) => ShoppingItem)
  @Field()
  item: ShoppingItem;

  @Column({ default: 0 })
  @Field()
  count: number;

  @ManyToOne((type) => Cart, (cart) => cart.cartItemCounts)
  @JoinColumn()
  @Field()
  cart: Cart;

  @Column()
  price: number;
}
