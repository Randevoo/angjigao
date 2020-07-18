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
} from 'typeorm';
import { ObjectType, Field } from 'type-graphql';
import { Cart } from 'src/models/Cart/Cart';

@ObjectType({ description: 'Object representing an Order' })
@Entity({ name: 'item_order' })
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @ManyToMany((type) => ShoppingItem, (item) => item.orders, { cascade: true })
  items: ShoppingItem[];

  @ManyToOne((type) => Cart, (cart) => cart.orders)
  cart: Cart;

  @ManyToOne((type) => User, (user) => user.orders)
  @JoinColumn()
  buyer: User;

  @ManyToOne((type) => Shop, (shop) => shop.orders)
  @JoinColumn()
  shop: Shop;

  @Column({ nullable: true })
  charge_id: string;

  price: number;

  @AfterLoad()
  getPrice() {
    this.price = sumBy(this.items, (item) => item.price);
  }
}
