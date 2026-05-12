import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { MembershipCard } from "../../membership-card/entities/membership-card.entity";
import { Borrowing } from "../../borrowing/entities/borrowing.entity";

@Entity("members")
export class Member {
  @PrimaryGeneratedColumn()
  id!: number;

  // User ke saath 1:1 — Member ek User ka library profile hai
  @OneToOne(() => User, { eager: true })
  @JoinColumn()
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToOne(() => MembershipCard, (card) => card.member, { cascade: true })
  membershipCard?: MembershipCard;

  @OneToMany(() => Borrowing, (borrowing) => borrowing.member)
  borrowings?: Borrowing[];
}
