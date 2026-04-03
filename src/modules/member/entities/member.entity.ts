// src/modules/member/entities/member.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MembershipCard } from '../../membership-card/entities/membership-card.entity';
import { Borrowing } from '../../borrowing/entities/borrowing.entity';

@Entity('members')
export class Member {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  name!: string;

  @Column({ unique: true })
  email!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToOne(() => MembershipCard, (card) => card.member, {  cascade: true})
  membershipCard!: MembershipCard;

  @OneToMany(() => Borrowing, (borrowing) => borrowing.member)
  borrowings?: Borrowing[];
}
