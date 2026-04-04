import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({
    example: 'Clean Code',
    description: 'Title of the book',
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional({
    example: 2008,
    description: 'Year the book was published',
  })
  @IsNumber()
  @IsOptional()
  publishedYear?: number;

  @ApiProperty({
    example: 1,
    description: 'ID of the author who wrote the book',
  })
  @IsNumber()
  @IsNotEmpty()
  authorId!: number;
}