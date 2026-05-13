import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterMemberDto {
  @ApiProperty({ example: 'Ali Khan' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'ali@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123', minLength: 8 })
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;
}
