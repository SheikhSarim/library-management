import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
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
  async create(createBookDto: CreateBookDto, user: any): Promise<any> {
    try {
      // 🔐 1. Validate JWT user
      if (!user || !user.sub) {
        throw new UnauthorizedException('Invalid user token');
      }

      console.log('👤 JWT USER:', user);

      // 👤 2. Get author from DB using JWT id
      const author = await this.authorService.findByUserId(user.sub);

      if (!author) {
        throw new NotFoundException('Author not found');
      }

      console.log('📚 AUTHOR FOUND:', author);

      // 📦 3. Create book entity
      const book = this.bookRepository.create({
        title: createBookDto.title,
        publishedYear: createBookDto.publishedYear,
        author,
      });

      // 💾 4. Save to DB
      const savedBook = await this.bookRepository.save(book);

      return {
        id: savedBook.id,
        title: savedBook.title,
        publishedYear: savedBook.publishedYear,
        authorId: author.id,
        authorName: author.user.name,
        createdAt: savedBook.createdAt,
      };
    } catch (error: any) {
      // 🔥 FULL ERROR LOGGING (IMPORTANT)
      console.error('🔥 CREATE BOOK ERROR:', error);

      if (error.code === '23505') {
        throw new ConflictException('A book with this title already exists');
      }

      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        error.message || 'Something went wrong while creating book',
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
          // authorName: book.author.user.name,
          createdAt: book.createdAt,
        })),
        meta: paginatedResult.meta,
      };
    } catch (error: any) {
      console.log(error);
      
      throw new InternalServerErrorException('Failed to fetch books');
    }
  }
  // Returns raw Book entity (for borrowing service)
  async findOne(id: number): Promise<Book> {
    const book = await this.bookRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!book) {
      throw new NotFoundException('Book with ID ' + id + ' not found');
    }
    return book;
  }
}
