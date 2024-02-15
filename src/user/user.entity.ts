import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import { hash } from 'bcrypt';
import { UserRole } from './types/enums';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @Column()
  role: UserRole;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }

  @ManyToOne(() => UserEntity, (user) => user.subordinates)
  boss: UserEntity;

  @OneToMany(() => UserEntity, (user) => user.boss)
  subordinates: UserEntity[];
}
