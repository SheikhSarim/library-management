import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Book } from '../../book/entities/book.entity';
import { User } from '../../users/entities/user.entity';

@Entity('authors')
export class Author {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ nullable: true })
  userId!: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user!: User;

  // One-to-Many: One Author can have many Books
  @OneToMany(() => Book, (book) => book.author)
  books?: Book[];
}
