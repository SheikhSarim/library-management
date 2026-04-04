import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Author } from '../../author/entities/author.entity';
import { Borrowing } from '../../borrowing/entities/borrowing.entity';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  title!: string;

  @Column({ nullable: true })
  publishedYear!: number;

  @ManyToOne(() => Author, (author) => author.books, { nullable: false })
  author!: Author;

  // 1:N with Borrowing
  @OneToMany(() => Borrowing, (borrowing) => borrowing.book)
  borrowings?: Borrowing[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}