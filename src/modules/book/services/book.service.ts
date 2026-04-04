// src/modules/book/services/book.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '../entities/book.entity';
import { CreateBookDto } from '../dto/create-book.dto';
import { AuthorService } from '../../author/services/author.service';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,

    private readonly authorService: AuthorService,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<any> {
    const author = await this.authorService.findOne(createBookDto.authorId);

    const book = this.bookRepository.create({
      title: createBookDto.title,
      publishedYear: createBookDto.publishedYear,
      author,
    });

    const savedBook = await this.bookRepository.save(book);

    return {
      id: savedBook.id,
      title: savedBook.title,
      publishedYear: savedBook.publishedYear,
      authorId: author.id,
      authorName: author.name,
      createdAt: savedBook.createdAt,
    };
  }

  async findAll(): Promise<any[]> {
    const books = await this.bookRepository.find({
      relations: ['author'],
    });

    return books.map((book) => ({
      id: book.id,
      title: book.title,
      publishedYear: book.publishedYear,
      authorId: book.author?.id,
      authorName: book.author?.name,
      createdAt: book.createdAt,
    }));
  }

  async findOne(id: number): Promise<any> {
    const book = await this.bookRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return {
      id: book.id,
      title: book.title,
      publishedYear: book.publishedYear,
      authorId: book.author?.id,
      authorName: book.author?.name,
      createdAt: book.createdAt,
    };
  }
}