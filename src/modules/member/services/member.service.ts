import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Member } from "../entities/member.entity";
import { MembershipCard } from "../../membership-card/entities/membership-card.entity";
import { User } from "../../users/entities/user.entity";

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,

    @InjectRepository(MembershipCard)
    private readonly cardRepository: Repository<MembershipCard>,
  ) {}

  // Auth register ke baad auto-call hoga
  async createForUser(user: User): Promise<Member> {
    try {
      const issueDate = new Date();
      const expiryDate = new Date(issueDate);
      expiryDate.setFullYear(issueDate.getFullYear() + 1);

      const member = this.memberRepository.create({
        user,
        membershipCard: {
          issueDate,
          expiryDate,
        },
      });

      return await this.memberRepository.save(member);
    } catch (error: any) {
      if (error.code === "23505") {
        throw new ConflictException("Member already exists for this user");
      }
      throw new InternalServerErrorException(
        "Something went wrong while creating member",
      );
    }
  }

  async findAll(): Promise<Member[]> {
    return this.memberRepository.find({
      relations: ["user", "membershipCard"],
    });
  }

  async findOne(id: number): Promise<Member> {
    const member = await this.memberRepository.findOne({
      where: { id },
      relations: ["user", "membershipCard", "borrowings"],
    });
    if (!member) {
      throw new NotFoundException("Member with ID " + id + " not found");
    }
    return member;
  }

  async findByUserId(userId: number): Promise<Member> {
    const member = await this.memberRepository.findOne({
      where: { user: { id: userId } },
      relations: ["user", "membershipCard"],
    });
    if (!member) {
      throw new NotFoundException("No member profile found for this user");
    }
    return member;
  }
}
