import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '../entities/book.entity';
import { CreateBookDto } from '../dto/create-book.dto';
import { AuthorService } from '../../author/services/author.service';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { PaginationProvider } from '../../../common/provider/pagination.provider';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,

    private readonly authorService: AuthorService,
    private readonly paginationProvider: PaginationProvider,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<any> {
    try {
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
    } catch (error: any) {
      if (error.code === '23505') {
        throw new ConflictException('A book with this title already exists');
      }
      console.error('Create Book Error:', error);
      throw new InternalServerErrorException(
        'Something went wrong while creating book',
      );
    }
  }

  async findAll(paginationQuery: PaginationQueryDto): Promise<any> {
    try {
      const paginatedResult = await this.paginationProvider.paginateQuery(
        paginationQuery,
        this.bookRepository,
      );

      return {
        data: paginatedResult.data.map((book) => ({
          id: book.id,
          title: book.title,
          publishedYear: book.publishedYear,
          authorId: book.author?.id,
          authorName: book.author?.name,
          createdAt: book.createdAt,
        })),
        meta: paginatedResult.meta,
      };
    } catch (error: any) {
      throw new InternalServerErrorException('Failed to fetch books');
    }
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
