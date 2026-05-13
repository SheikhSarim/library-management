import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { LoginMemberDto } from '../dto/login-member.dto';
import { GoogleTokenDto } from '../social/dtos/google-token.dto';
import { UsersService } from '../../users/service/users.service';
import { HashProvider } from './hash.provider';
import { GenerateTokenProvider } from './generate-token.provider';
import { GoogleAuthService } from '../social/providers/google-auth.service';
import { Role } from '../../../common/enum/roles.enum';

@Injectable()
export class LoginMemberProvider {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashProvider: HashProvider,
    private readonly generateTokenProvider: GenerateTokenProvider,
    private readonly googleAuthService: GoogleAuthService,
  ) {}

  // ──────────────────────────────
  // EMAIL + PASSWORD LOGIN
  // ──────────────────────────────
  async loginByEmail(dto: LoginMemberDto) {
    const user = await this.usersService.findUserByEmail(dto.email);

    if (user.role !== Role.MEMBER) {
      throw new ForbiddenException('This login is for Members only. Use /auth/author/login.');
    }

    const isValid = await this.hashProvider.comparePassword(dto.password, user.password!);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const tokens = await this.generateTokenProvider.generateTokens(user);

    return {
      success: true,
      message: 'Member logged in successfully',
      data: {
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        ...tokens,
      },
    };
  }

  // ──────────────────────────────
  // GOOGLE LOGIN
  // ──────────────────────────────
  async loginByGoogle(googleTokenDto: GoogleTokenDto) {
    const googleUser = await this.googleAuthService.verifyToken(googleTokenDto.token);
    const user = await this.usersService.findUserByEmail(googleUser.email);

    if (user.role !== Role.MEMBER) {
      throw new ForbiddenException('This Google login is for Members only.');
    }

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
}
