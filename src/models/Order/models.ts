import { User, Shop } from 'src/models/User/models';
import { ShoppingItem } from 'src/models/ShoppingItem/models';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field } from 'type-graphql';

@ObjectType({ description: 'Object representing an Order' })
@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  item_id: string;

  @ManyToMany((type) => ShoppingItem, (item) => item.orders, { cascade: true })
  @JoinTable()
  items: ShoppingItem[];

  @Field()
  buyer_id: string;

  @ManyToOne((type) => User, (user) => user.orders)
  @JoinColumn()
  buyer: User;

  @Field()
  shop_id: string;

  @ManyToOne((type) => Shop, (shop) => shop.orders)
  @JoinColumn()
  shop: Shop;

  @Field()
  charge_id: string;
}
