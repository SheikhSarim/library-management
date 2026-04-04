import { Module } from '@nestjs/common';
import { BookController } from './book/book.controller';
import { BookService } from './services/book.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Author } from '../author/entities/author.entity';
import { AuthorModule } from '../author/author.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book, Author]),
    AuthorModule,
  ],
  controllers: [BookController],
  providers: [BookService],
  exports: [BookService],
})
export class BookModule {}
