import { Injectable, ConflictException } from '@nestjs/common';
import { RegisterMemberDto } from '../dto/register-member.dto';
import { GoogleTokenDto } from '../social/dtos/google-token.dto';
import { UsersService } from '../../users/service/users.service';
import { MemberService } from '../../member/services/member.service';
import { HashProvider } from './hash.provider';
import { GenerateTokenProvider } from './generate-token.provider';
import { GoogleAuthService } from '../social/providers/google-auth.service';
import { Role } from '../../../common/enum/roles.enum';

@Injectable()
export class RegisterMemberProvider {
  constructor(
    private readonly usersService: UsersService,
    private readonly memberService: MemberService,
    private readonly hashProvider: HashProvider,
    private readonly generateTokenProvider: GenerateTokenProvider,
    private readonly googleAuthService: GoogleAuthService,
  ) {}

  async registerByEmail(dto: RegisterMemberDto) {
    const existing = await this.usersService.findUserByEmailOrNull(dto.email);
    if (existing) {
      throw new ConflictException('Email already registered.');
    }

    const hashedPassword = await this.hashProvider.hashPassword(dto.password);

    const user = await this.usersService.createUser({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role: Role.MEMBER,
    });

    const member = await this.memberService.createForUser(user);

    const tokens = await this.generateTokenProvider.generateTokens(user);

    return {
      success: true,
      message: 'Member registered successfully',
      data: {
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        member: { id: member.id, membershipCard: member.membershipCard },
        ...tokens,
      },
    };
  }

  async registerByGoogle(googleTokenDto: GoogleTokenDto) {
    const googleUser = await this.googleAuthService.verifyToken(googleTokenDto.token);

    let user = await this.usersService.findUserByEmailOrNull(googleUser.email);

    if (user) {
      const tokens = await this.generateTokenProvider.generateTokens(user);
      return {
        success: true,
        message: 'Member logged in via Google',
        data: {
          user: { id: user.id, name: user.name, email: user.email, role: user.role },
          ...tokens,
        },
      };
    }

    user = await this.usersService.createGoogleUser({
      name: googleUser.name,
      email: googleUser.email,
      googleId: googleUser.googleId,
      role: Role.MEMBER,
    });


    const member = await this.memberService.createForUser(user);


    const tokens = await this.generateTokenProvider.generateTokens(user);

    return {
      success: true,
      message: 'Member registered successfully via Google',
      data: {
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        member: { id: member.id, membershipCard: member.membershipCard },
        ...tokens,
      },
    };
  }
}
