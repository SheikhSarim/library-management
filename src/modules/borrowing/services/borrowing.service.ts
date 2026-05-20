import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
import { Borrowing } from "../entities/borrowing.entity";
import { BorrowBookDto } from "../dto/borrow-book.dto";
import { MemberService } from "../../member/services/member.service";
import { BookService } from "../../book/services/book.service";

@Injectable()
export class BorrowingService {
  constructor(
    @InjectRepository(Borrowing)
    private readonly borrowingRepository: Repository<Borrowing>,
    private readonly memberService: MemberService,
    private readonly bookService: BookService,
  ) {}

  async borrowBook(borrowBookDto: BorrowBookDto): Promise<any> {
    // Step 1: Member fetch karo (user relation bhi chahiye)
    const member = await this.memberService.findOne(borrowBookDto.memberId);

    // Step 2: MembershipCard check — card nahi hai to borrow nahi kar sakta
    if (!member.membershipCard) {
      throw new ForbiddenException(
        "Membership card required to borrow a book.",
      );
    }

    // Step 3: Card expiry check
    const now = new Date();
    if (member.membershipCard.expiryDate < now) {
      throw new ForbiddenException(
        "Your membership card has expired. Please renew it.",
      );
    }

    // Step 4: Book fetch karo
    const book = await this.bookService.findOne(borrowBookDto.bookId);

    // Step 5: Book already borrowed hai?
    const existingBorrowing = await this.borrowingRepository.findOne({
      where: { book: { id: book.id }, returnDate: IsNull() },
    });
    if (existingBorrowing) {
      throw new BadRequestException(
        "Book '" + book.title + "' is already borrowed.",
      );
    }

    // Step 6: Borrowing record create karo
    const borrowing = this.borrowingRepository.create({
      member,
      book,
      borrowDate: new Date(),
    });

    try {
      const saved = await this.borrowingRepository.save(borrowing);
      return {
        success: true,
        message: "Book borrowed successfully",
        data: {
          id: saved.id,
          memberId: member.id,
          // memberName: member.user.name,
          bookId: book.id,
          bookTitle: book.title,
          borrowDate: saved.borrowDate,
          cardExpiresOn: member.membershipCard.expiryDate,
        },
      };
    } catch (error: any) {
      throw new InternalServerErrorException("Failed to borrow the book");
    }
  }
}
