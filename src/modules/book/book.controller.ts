import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Request,
  Query,
} from '@nestjs/common';
import { BookService } from './services/book.service';
import { CreateBookDto } from './dto/create-book.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../../common/enum/roles.enum';
import { Auth } from '../auth/decorators/auth.decorator';
import { AuthType } from '../auth/enum/auth-type.enum';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

@ApiTags('Books')
@ApiBearerAuth()
@Controller('api/v1/books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @ApiBearerAuth()
  @Roles(Role.AUTHOR) // AUTHOR only
  @ApiOperation({ summary: 'Add a new book (AUTHOR only)' })
  async create(@Body() createBookDto: CreateBookDto, @Request() req) {
    return this.bookService.create(createBookDto, req.user);
  }

  @Get()
  @Auth(AuthType.None) // public
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
  @Auth(AuthType.None) // public
  @ApiOperation({ summary: 'Get book by ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const book = await this.bookService.findOne(id);
    return { success: true, message: 'Book fetched successfully', data: book };
  }
}
