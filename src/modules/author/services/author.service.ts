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
import { User } from '../../users/entities/user.entity';

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
  ) {}

  /**
   * Create Author Profile linked to User
   */
  async createForUser(user: User): Promise<Author> {
    try {
      const existingAuthor = await this.authorRepository.findOne({
        where: { user: { id: user.id } },
        relations: ['user'],
      });

      if (existingAuthor) {
        return existingAuthor;
      }

      const author = this.authorRepository.create({
        user: user,
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
        relations: ['user', 'books'], // books agar relation hai to
      });
    } catch (error: any) {
      console.error('Find All Authors Error:', error);
      throw new InternalServerErrorException('Failed to fetch authors');
    }
  }

  async findByUserId(userId: number): Promise<Author> {
    const author = await this.authorRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!author) {
      throw new NotFoundException(`Author not found for user ID ${userId}`);
    }

    return author;
  }

  // Optional: Find by Author ID
  async findOne(id: number): Promise<Author> {
    const author = await this.authorRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!author) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }

    return author;
  }
}
