// src/modules/borrowing/borrowing.controller.ts
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { BorrowingService } from '../services/borrowing.service';
import { BorrowBookDto } from '../dto/borrow-book.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Borrowings')
@Controller('api/v1/borrowings')
export class BorrowingController {
  constructor(private readonly borrowingService: BorrowingService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Borrow a book' })
  async borrowBook(@Body() borrowBookDto: BorrowBookDto) {
    const borrowing = await this.borrowingService.borrowBook(borrowBookDto);
    return {
      success: true,
      message: 'Book borrowed successfully',
      data: borrowing,
    };
  }
}