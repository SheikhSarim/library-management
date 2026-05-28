import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Book } from '../../book/entities/book.entity';

@Entity('authors')
export class Author {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => User, (user) => user.author)
  @JoinColumn()
  user!: User;

  @Column({ length: 100, nullable: true }) 
  name?: string;

  @Column({ nullable: true })
  bio?: string;

  @Column({ nullable: true })
  penName?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Book, (book) => book.author)
  books?: Book[];
}
