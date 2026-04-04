// src/modules/author/author.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Author } from './entities/author.entity';
import { Book } from '../book/entities/book.entity';   // for relation
import { AuthorService } from './services/author.service';
import { AuthorController } from './author/author.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Author, Book])],
  providers: [AuthorService],
  controllers: [AuthorController],
  exports: [AuthorService],
})
export class AuthorModule {}