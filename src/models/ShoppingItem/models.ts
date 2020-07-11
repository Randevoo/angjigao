import { User } from 'src/models/User/models';
import { Field, ObjectType, Int } from 'type-graphql';
import { PrimaryGeneratedColumn, Column, Entity, OneToOne, JoinColumn } from 'typeorm';

@Entity()
@ObjectType({ description: 'Object representing a Shopping Item' })
export class ShoppingItem {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  price: number;

  @Column()
  @Field()
  description: string;

  @Column()
  @Field()
  image_url: string;

  @Column('text', { array: true })
  @Field((type) => [String])
  categories: string[];
}

@ObjectType({ description: 'Object representing an Order' })
@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Field()
  item_id: string;

  @OneToOne((type) => ShoppingItem)
  @JoinColumn()
  item: ShoppingItem;

  @Field()
  buyer_id: string;

  @OneToOne((type) => User)
  @JoinColumn()
  buyer: User;

  @Field()
  seller_id: string;

  @OneToOne((type) => User)
  @JoinColumn()
  seller: User;

  @Field()
  charge_id: string;

  constructor(id: string, buyer: User, seller: User, charge_id: string) {
    this.id = id;
    this.buyer = buyer;
    this.seller = seller;
    this.charge_id = charge_id;
  }
}
