import { Field, ObjectType } from 'type-graphql';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
@ObjectType()
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
}
