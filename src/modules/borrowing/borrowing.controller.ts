import { Controller, Post, Body } from "@nestjs/common";
import { BorrowingService } from "./services/borrowing.service";
import { BorrowBookDto } from "./dto/borrow-book.dto";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { Roles } from "../auth/decorators/roles.decorator";
import { Role } from "../../common/enum/roles.enum";

@ApiTags("Borrowing")
@ApiBearerAuth()
@Controller("api/v1/borrowings")
export class BorrowingController {
  constructor(private readonly borrowingService: BorrowingService) {}

  @Post()
  @Roles(Role.MEMBER) // MEMBER only — must have card too
  @ApiOperation({ summary: "Borrow a book (MEMBER + valid card required)" })
  async borrowBook(@Body() borrowBookDto: BorrowBookDto) {
    return this.borrowingService.borrowBook(borrowBookDto);
  }
}
