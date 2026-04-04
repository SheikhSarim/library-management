import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthorService } from '../services/author.service';
import { CreateAuthorDto } from '../dto/create-author.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Authors')
@Controller('api/v1/authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new author' })
  async create(@Body() createAuthorDto: CreateAuthorDto) {
    const author = await this.authorService.create(createAuthorDto);
    return {
      success: true,
      message: 'Author created successfully',
      data: author,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all authors' })
  async findAll() {
    const authors = await this.authorService.findAll();
    return {
      success: true,
      message: 'Authors retrieved successfully',
      data: authors,
    };
  }
}
