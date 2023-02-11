import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  login: string;

  @Column()
  @Exclude()
  password: string;

  @VersionColumn()
  version: number;

  @CreateDateColumn()
  @CreateDateColumn({
    transformer: {
      from: (value) => value.getTime(),
      to: (value) => value,
    },
  })
  createdAt: number;

  @UpdateDateColumn({
    transformer: {
      from: (value) => value.getTime(),
      to: (value) => value,
    },
  })
  updatedAt: number;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
