import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAuthorDto {
  @ApiProperty({
    description: 'Full name of the author',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;
}
