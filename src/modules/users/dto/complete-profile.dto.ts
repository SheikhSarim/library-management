import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CompleteProfileDto {
  @ApiPropertyOptional({
    example: 'John Doe',
    description: 'User full name',
  })
  @IsOptional()
  @IsString()
  name?: string;

  // Member fields
  @ApiPropertyOptional({
    example: '+92 300 1234567',
    description: 'User phone number',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    example: 'Karachi, Pakistan',
    description: 'User address',
  })
  @IsOptional()
  @IsString()
  address?: string;

  // Author fields
  @ApiPropertyOptional({
    example: 'I am a passionate writer...',
    description: 'Short biography of author',
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({
    example: 'J. Doe',
    description: 'Pen name for author profile',
  })
  @IsOptional()
  @IsString()
  penName?: string;
}