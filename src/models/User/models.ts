import { Cart } from 'src/models/Cart/Cart';
import { Order } from 'src/models/Order/models';
import { ShoppingItem } from 'src/models/ShoppingItem/models';
import { Field, ObjectType } from 'type-graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
  Unique,
  OneToOne,
} from 'typeorm';

@Entity({ name: 'user_buyer' })
@ObjectType()
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Field()
  @Column()
  username: string;

  @Field()
  @Column()
  dob: Date;

  @Field()
  @Column()
  password: string;

  @JoinColumn()
  @OneToMany((type) => Order, (item) => item, {
    cascade: true,
  })
  orders: Order[];

  @OneToMany((type) => Cart, (cart) => cart.owner)
  cart: Cart[];
}

@Entity()
@ObjectType()
@Unique(['username'])
export class Shop {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Field()
  @Column()
  username: string;

  @Field()
  @Column()
  dob: Date;

  @Field()
  @Column()
  password: string;

  @JoinColumn()
  @OneToMany((type) => ShoppingItem, (item) => item, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  items: ShoppingItem[];

  @JoinColumn()
  @OneToMany((type) => Order, (item) => item, {
    cascade: true,
  })
  orders: Order[];
}
