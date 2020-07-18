import { sumBy } from 'lodash';
import { User, Shop } from 'src/models/User/models';
import { ShoppingItem } from 'src/models/ShoppingItem/models';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  ManyToOne,
  JoinColumn,
  AfterLoad,
  Column,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { ObjectType, Field } from 'type-graphql';
import { Cart } from 'src/models/Cart/Cart';

@ObjectType({ description: 'Object representing an Order' })
@Entity({ name: 'item_order' })
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @OneToMany((type) => OrderItemCount, (orderItemCount) => orderItemCount.order, { cascade: true })
  @JoinColumn()
  itemAndCounts: OrderItemCount[];

  @ManyToOne((type) => Cart, (cart) => cart.orders)
  @JoinColumn()
  cart: Cart;

  @ManyToOne((type) => User, (user) => user.orders)
  @JoinColumn()
  buyer: User;

  @ManyToOne((type) => Shop, (shop) => shop.orders)
  @JoinColumn()
  shop: Shop;

  @Column({ nullable: true })
  charge_id: string;
}

@ObjectType({ description: 'Join table for shopping items and its count in an order' })
@Entity()
export class OrderItemCount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne((type) => ShoppingItem)
  item: ShoppingItem;

  @Column({ default: 0 })
  count: number;

  @ManyToOne((type) => Order, (order) => order.itemAndCounts)
  @JoinColumn()
  order: Order;
}
