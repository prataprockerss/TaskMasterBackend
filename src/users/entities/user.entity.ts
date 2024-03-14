import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  addedOn: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  updatedOn: string;
}
