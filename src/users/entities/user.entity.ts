import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { UserRoles} from "./userRole.entity";

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('uuid',{unique: true})
  guid: string;

  @Column({
    length: 200,
    unique: true
  })
  email: string;

  @Column({
    type: 'bigint',
    nullable: true,
  })
  mobile: number;

  @Column({
    length: 300
  })
  password: string;

  @Column({
    unique: true,
  })
  username: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  created_at: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  updated_at: Date;

  @Column({
    nullable: true,
    type: 'timestamp'
  })
  updated_by: string;

  @Column({
    nullable: false,
  })
  created_by: string;

  @OneToMany(() => UserRoles,(role) => role.user)
  roles: UserRoles[]
}
