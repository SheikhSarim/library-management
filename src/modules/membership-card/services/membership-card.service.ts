// src/modules/membership-card/services/membership-card.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MembershipCard } from '../entities/membership-card.entity';

@Injectable()
export class MembershipCardService {
  constructor(
    @InjectRepository(MembershipCard)
    private readonly cardRepository: Repository<MembershipCard>,
  ) {}

  async getCardByMember(memberId: number): Promise<MembershipCard> {
    const card = await this.cardRepository.findOne({
      where: { member: { id: memberId } },
      relations: ['member'],
    });

    if (!card) {
      throw new NotFoundException(`No membership card found for member ID ${memberId}`);
    }

    return card;
  }
}