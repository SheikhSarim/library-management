// src/modules/author/services/author.service.ts
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from '../entities/author.entity';
import { CreateAuthorDto } from '../dto/create-author.dto';

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
  ) {}

  async create(createAuthorDto: CreateAuthorDto): Promise<Author> {
    try {
      const author = this.authorRepository.create(createAuthorDto);
      return await this.authorRepository.save(author);
    } catch (error: any) {
      if (error.code === '23505') {
        throw new ConflictException('An author with this name already exists');
      }
      throw new InternalServerErrorException(
        'Something went wrong while creating author',
      );
    }
  }

  async findAll(): Promise<Author[]> {
    try {
      return await this.authorRepository.find({
        relations: ['books'],
      });
    } catch (error: any) {
      console.error('Find All Authors Error:', error);
      throw new InternalServerErrorException('Failed to fetch authors');
    }
  }

  async findOne(id: number): Promise<Author> {
    const author = await this.authorRepository.findOne({
      where: { id },
      relations: ['books'],
    });

    if (!author) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }
    return author;
  }
}
