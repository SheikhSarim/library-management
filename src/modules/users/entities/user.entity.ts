import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../../../common/enum/roles.enum';
import { Author } from '../../author/entities/author.entity';
import { Member } from '../../member/entities/member.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ type: 'enum', enum: Role })
  role!: Role;

  @OneToOne(() => Author, (author) => author.user)
  author!: Author;

  @OneToOne(() => Member, (member) => member.user)
  member!: Member;

  @Column({ nullable: true })
  googleId?: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
