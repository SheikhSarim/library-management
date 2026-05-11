import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { BookService } from '../services/book.service';
import { CreateBookDto } from '../dto/create-book.dto';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

@ApiTags('Books')
@Controller('api/v1/books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new book' })
  async create(@Body() createBookDto: CreateBookDto) {
    const book = await this.bookService.create(createBookDto);
    return {
      success: true,
      message: 'Book created successfully',
      data: book,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all books with pagination' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  async findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    const books = await this.bookService.findAll(paginationQueryDto);
    return {
      success: true,
      message: 'Books retrieved successfully',
      ...books,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get book by ID' })
  async findOne(@Param('id') id: number) {
    const book = await this.bookService.findOne(id);
    return {
      success: true,
      message: 'Book retrieved successfully',
      data: book,
    };
  }
}
