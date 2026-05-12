// src/modules/member/member.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { MembershipCard } from '../membership-card/entities/membership-card.entity';
import { MemberService } from './services/member.service';
import { MemberController } from './member.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Member, MembershipCard])],
  providers: [MemberService],
  controllers: [MemberController],
  exports: [MemberService],
})
export class MemberModule {}