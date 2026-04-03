// src/modules/member/services/member.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from '../entities/member.entity';
import { CreateMemberDto } from '../dto/create-member.dto';
import { MembershipCard } from '../../membership-card/entities/membership-card.entity';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,

    @InjectRepository(MembershipCard)
    private readonly cardRepository: Repository<MembershipCard>,
  ) {}

  async create(createMemberDto: CreateMemberDto): Promise<Member> {
    const issueDate = new Date();
    const expiryDate = new Date(issueDate);
    expiryDate.setFullYear(issueDate.getFullYear() + 1);

    const member = this.memberRepository.create({
      ...createMemberDto,
      membershipCard: {
        issueDate,
        expiryDate,
      },
    });

    return await this.memberRepository.save(member);
  }

  async findAll(): Promise<Member[]> {
    return await this.memberRepository.find({
      relations: ['membershipCard'],
    });
  }

  async findOne(id: number): Promise<Member> {
    const member = await this.memberRepository.findOne({
      where: { id },
      relations: ['membershipCard', 'borrowings'],
    });

    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }
    return member;
  }
}
