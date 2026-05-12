import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMemberDto {
  @ApiProperty({
    description: 'Full name of the member',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  // @ApiProperty({
  //   description: 'Email address of the member',
  //   example: 'john.doe@example.com',
  // })
  // @IsEmail()
  // @IsNotEmpty()
  // email!: string;
}