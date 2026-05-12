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

  async create(user: any): Promise<Author> {
    try {
      // 🔐 1. Check if author already exists for this user
      const existingAuthor = await this.authorRepository.findOne({
        where: { userId: user.id },
      });

      if (existingAuthor) {
        return existingAuthor;
      }

      // 👇 2. Create author linked to userId (FK)
      const author = this.authorRepository.create({
        userId: user.id,
      });

      return await this.authorRepository.save(author);
    } catch (error: any) {
      console.error('🔥 AUTHOR CREATE ERROR:', error);

      if (error.code === '23505') {
        throw new ConflictException('Author already exists for this user');
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

  async findByUserId(userId: number): Promise<Author> {
    const author = await this.authorRepository.findOne({
      where: { userId },
      relations: ['user'],
    });

    if (!author) {
      throw new NotFoundException('Author not found');
    }

    return author;
  }
}
