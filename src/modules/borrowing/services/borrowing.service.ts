import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Borrowing } from '../entities/borrowing.entity';
import { BorrowBookDto } from '../dto/borrow-book.dto';
import { MemberService } from '../../member/services/member.service';
import { BookService } from '../../book/services/book.service';

@Injectable()
export class BorrowingService {
  constructor(
    @InjectRepository(Borrowing)
    private readonly borrowingRepository: Repository<Borrowing>,

    private readonly memberService: MemberService,
    private readonly bookService: BookService,
  ) {}

  async borrowBook(borrowBookDto: BorrowBookDto): Promise<any> {
    const member = await this.memberService.findOne(borrowBookDto.memberId);
    const book = await this.bookService.findOne(borrowBookDto.bookId);
    const existingBorrowing = await this.borrowingRepository.findOne({
      where: { book: { id: book.id }, returnDate: IsNull() },
    });
    if (existingBorrowing) {
      throw new BadRequestException(
        `Book '${book.title}' is already borrowed.`,
      );
    }

    const borrowing = this.borrowingRepository.create({
      member,
      book,
      borrowDate: new Date(),
    });

    const savedBorrowing = await this.borrowingRepository.save(borrowing);

    return {
      id: savedBorrowing.id,
      memberId: member.id,
      memberName: member.name,
      bookId: book.id,
      bookTitle: book.title, 
      borrowDate: savedBorrowing.borrowDate,
      createdAt: savedBorrowing.createdAt,
    };
  }
}
