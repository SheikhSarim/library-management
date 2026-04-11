import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
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
    try {
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
    } catch (error: any) {
      if (error.code === '23505') {
        throw new ConflictException('A member with this email already exists');
      }
      throw new InternalServerErrorException(
        'Something went wrong while creating member',
      );
    }
  }

  async findAll(): Promise<Member[]> {
    try {
      return await this.memberRepository.find({
        relations: ['membershipCard'],
      });
    } catch (error) {
      console.error('Find All Members Error:', error);
      throw new InternalServerErrorException('Failed to fetch members');
    }
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
