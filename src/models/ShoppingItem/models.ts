import { Shop } from 'src/models/User/models';
import { Field, ObjectType, Int } from 'type-graphql';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
@ObjectType({ description: 'Object representing a Shopping Item' })
export class ShoppingItem {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @JoinColumn()
  @ManyToOne((type) => Shop, (shop) => shop.id)
  shop: Shop;

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
