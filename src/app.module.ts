import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { MemberModule } from './modules/member/member.module';
// import { BorrowingModule } from './modules/borrowing/borrowing.module';
// import { BookModule } from './modules/book/book.module';
// import { AuthorModule } from './modules/author/author.module';
// import { MembershipCardModule } from './modules/membership-card/membership-card.module';
// import { MemberModule } from './modules/member/member.module';

@Module({
  // imports: [MemberModule, MembershipCardModule, AuthorModule, BookModule, BorrowingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
